from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Dict

from ..core.database import get_db
from .auth import get_current_user
from ..models.user import User
from ..services.multiplayer_service import MultiplayerService

router = APIRouter(prefix="/multiplayer", tags=["multiplayer"])

# Store active connections: lobby_id -> List[WebSocket]
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, lobby_id: str, websocket: WebSocket):
        await websocket.accept()
        if lobby_id not in self.active_connections:
            self.active_connections[lobby_id] = []
        self.active_connections[lobby_id].append(websocket)

    def disconnect(self, lobby_id: str, websocket: WebSocket):
        if lobby_id in self.active_connections:
            self.active_connections[lobby_id].remove(websocket)
            if not self.active_connections[lobby_id]:
                del self.active_connections[lobby_id]

    async def broadcast(self, lobby_id: str, message: dict):
        if lobby_id in self.active_connections:
            for connection in self.active_connections[lobby_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Handle stale connections if needed
                    pass

manager = ConnectionManager()


@router.post("/lobby/create")
def create_lobby(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new multiplayer lobby"""
    lobby = MultiplayerService.create_lobby(db, current_user)
    return {"lobby_id": lobby.id}


@router.post("/lobby/join/{lobby_id}")
def join_lobby(
    lobby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Join an existing lobby"""
    player = MultiplayerService.join_lobby(db, lobby_id, current_user)
    return {"message": "Joined successfully", "lobby_id": lobby_id}

@router.get("/lobby/{lobby_id}")
def get_lobby_info(
    lobby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    status = MultiplayerService.get_lobby_status(db, lobby_id)
    if not status:
        raise HTTPException(status_code=404, detail="Lobby not found")
    return status

@router.post("/lobby/{lobby_id}/ready")
async def toggle_ready(
    lobby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle ready status"""
    is_ready = MultiplayerService.toggle_ready(db, lobby_id, current_user)
    # Broadcast update
    await manager.broadcast(lobby_id, {
        "type": "LOBBY_UPDATE", 
        "data": MultiplayerService.get_lobby_status(db, lobby_id)
    })
    return {"is_ready": is_ready}

@router.post("/lobby/{lobby_id}/start")
async def start_game(
    lobby_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start the game (Host only)"""
    round_data = MultiplayerService.start_game(db, lobby_id, current_user)
    await manager.broadcast(lobby_id, {
        "type": "GAME_START", 
        "lobby_id": lobby_id,
        "round": round_data
    })
    return {"message": "Game started"}


@router.websocket("/ws/{lobby_id}/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    lobby_id: str, 
    user_id: int,
    db: Session = Depends(get_db)
):
    await manager.connect(lobby_id, websocket)
    try:
        # Notify others that a user connected (simplified)
        # In production, verify user_id with token in handshake
        
        # Send current state immediately
        status = MultiplayerService.get_lobby_status(db, lobby_id)
        if status:
            await manager.broadcast(lobby_id, {"type": "LOBBY_UPDATE", "data": status})

        while True:
            data = await websocket.receive_json()
            # Handle game events here (e.g., PLAYER_READY, GAME_START)
            # For now, just echo or broadcast updates
            
            if data.get("type") == "CHAT":
                 await manager.broadcast(lobby_id, {"type": "CHAT", "user_id": user_id, "message": data.get("message")})
            
            elif data.get("type") == "GUESS":
                result = MultiplayerService.process_guess(db, lobby_id, user_id, data.get("index"))
                if result:
                     # Calculate correct index for client revelation (only if round over)
                     # But for now, just tell connection about their guess correctness
                     
                     # 1. Notify everyone about score update
                     await manager.broadcast(lobby_id, {
                         "type": "PLAYER_UPDATE",
                         "user_id": user_id,
                         "score": result["score_total"]
                     })
                     
                     # 2. If all guessed, end round
                     if result["all_guessed"]:
                        # Reveal answer
                        game_state = MultiplayerService.active_games.get(lobby_id)
                        correct_index = game_state["round"]["correct_index"]
                        
                        await manager.broadcast(lobby_id, {
                            "type": "ROUND_RESULT",
                            "correct_index": correct_index,
                            "scores": MultiplayerService.get_lobby_status(db, lobby_id)["players"]
                        })
                        
                        # Start new round after delay (client handles delay, we send data)
                        import asyncio
                        await asyncio.sleep(3) # Wait 3 sec
                        
                        new_round = MultiplayerService.start_new_round(db, lobby_id)
                        if new_round:
                             await manager.broadcast(lobby_id, {
                                "type": "NEW_ROUND",
                                "data": new_round
                            })
                        else:
                             await manager.broadcast(lobby_id, {
                                "type": "GAME_OVER",
                                "scores": MultiplayerService.get_lobby_status(db, lobby_id)["players"]
                             })
            
    except WebSocketDisconnect:
        manager.disconnect(lobby_id, websocket)
        # Notify disconnection
        await manager.broadcast(lobby_id, {"type": "PLAYER_LEFT", "user_id": user_id})
