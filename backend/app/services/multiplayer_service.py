import random
import string
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from ..models.multiplayer import Lobby, LobbyPlayer
from ..models.user import User

class MultiplayerService:
    @staticmethod
    def generate_lobby_code(length=6) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

    @staticmethod
    def create_lobby(db: Session, host_user: User) -> Lobby:
        """Create a new lobby usually hosted by the creator"""
        # Ensure user isn't already in an active lobby to prevent zombie states
        # (Simplified: Just create new for now)
        
        code = MultiplayerService.generate_lobby_code()
        while db.query(Lobby).filter(Lobby.id == code).first():
            code = MultiplayerService.generate_lobby_code()
            
        lobby = Lobby(
            id=code,
            host_id=host_user.id,
            status="WAITING"
        )
        db.add(lobby)
        db.commit()
        
        # Add host as player
        MultiplayerService.join_lobby(db, code, host_user)
        
        db.refresh(lobby)
        return lobby

    @staticmethod
    def join_lobby(db: Session, lobby_id: str, user: User) -> LobbyPlayer:
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            raise HTTPException(status_code=404, detail="Lobby not found")
            
        if lobby.status != "WAITING":
            raise HTTPException(status_code=400, detail="Game already started")
            
        # Check if already joined
        existing = db.query(LobbyPlayer).filter(
            LobbyPlayer.lobby_id == lobby_id,
            LobbyPlayer.user_id == user.id
        ).first()
        
        if existing:
            return existing
            
        player = LobbyPlayer(
            lobby_id=lobby_id,
            user_id=user.id,
            is_ready=False
        )
        db.add(player)
        db.commit()
        db.refresh(player)
        return player

    @staticmethod
    def toggle_ready(db: Session, lobby_id: str, user: User) -> bool:
        player = db.query(LobbyPlayer).filter(
            LobbyPlayer.lobby_id == lobby_id,
            LobbyPlayer.user_id == user.id
        ).first()
        
        if not player:
            raise HTTPException(status_code=404, detail="Player not found in lobby")
            
        player.is_ready = not player.is_ready
        db.commit()
        return player.is_ready

    @staticmethod
    def start_game(db: Session, lobby_id: str, user: User) -> bool:
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            raise HTTPException(status_code=404, detail="Lobby not found")
            
        if lobby.host_id != user.id:
            raise HTTPException(status_code=403, detail="Only host can start the game")
            
        if len(lobby.players) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 players")
            
        # Optional: Check if all ready
        # not_ready = any(not p.is_ready for p in lobby.players if p.user_id != lobby.host_id)
        # if not_ready:
        #    raise HTTPException(status_code=400, detail="All players must be ready")
            
        lobby.status = "PLAYING"
        db.commit()
        return True

    @staticmethod
    def get_lobby_status(db: Session, lobby_id: str):
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            return None
            
        # Serialize players
        players_data = []
        for p in lobby.players:
            players_data.append({
                "user_id": p.user_id,
                "username": p.user.username,
                "is_ready": p.is_ready,
                "score": p.score,
                "is_host": (p.user_id == lobby.host_id)
            })
            
        return {
            "lobby_id": lobby.id,
            "status": lobby.status,
            "host_id": lobby.host_id,
            "players": players_data,
            "player_count": len(players_data)
        }
