import random
import string
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from ..models.multiplayer import Lobby, LobbyPlayer
from ..models.user import User

from ..models.game import Image
from ..models.scenario import Scenario
from datetime import datetime

class MultiplayerService:
    # In-memory state: lobby_id -> { round_data, user_guesses: {uid: bool} }
    # This is a simplification. For production, use Redis or DB.
    active_games = {}

    @staticmethod
    def generate_lobby_code(length=6) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

    @staticmethod
    def create_lobby(db: Session, host_user: User) -> Lobby:
        """Create a new lobby usually hosted by the creator"""
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
            # Allow rejoin if already in player list?
            existing = db.query(LobbyPlayer).filter(LobbyPlayer.lobby_id == lobby_id, LobbyPlayer.user_id == user.id).first()
            if existing: return existing
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
    def start_game(db: Session, lobby_id: str, user: User) -> dict:
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            raise HTTPException(status_code=404, detail="Lobby not found")
            
        if lobby.host_id != user.id:
            raise HTTPException(status_code=403, detail="Only host can start the game")
            
        if len(lobby.players) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 players")
            
        lobby.status = "PLAYING"
        db.commit()
        
        # Initialize first round
        return MultiplayerService.start_new_round(db, lobby_id)

    @staticmethod
    def start_new_round(db: Session, lobby_id: str) -> dict:
        # 1. Pick random Scenario
        scenario = db.query(Scenario).order_by(func.random()).first()
        if not scenario:
            # Fallback if no scenario
            images = db.query(Image).order_by(func.random()).limit(3).all()
        else:
             # Get scenario images (2 real, 1 AI)
            real_images = db.query(Image).filter(Image.scenario_id == scenario.id, Image.is_ai_generated == False).limit(2).all()
            ai_image = db.query(Image).filter(Image.scenario_id == scenario.id, Image.is_ai_generated == True).first()
            
            images = []
            if ai_image and len(real_images) >= 2:
                images = real_images + [ai_image]
            else:
                 # Fallback random
                 images = db.query(Image).order_by(func.random()).limit(3).all()

        if len(images) < 3:
             # Fail gracefully
             return None

        random.shuffle(images)
        ai_index = next((i for i, img in enumerate(images) if img.is_ai_generated), 0)

        round_data = {
            "round_number": MultiplayerService.active_games.get(lobby_id, {}).get("round_number", 0) + 1,
            "images": [{"id": img.id, "url": img.url} for img in images],
            "correct_index": ai_index,
            "scenario_prompt": scenario.prompt_text if scenario else "???",
            "time_limit": 30, # Default 30s
            "start_time": datetime.utcnow().timestamp()
        }

        MultiplayerService.active_games[lobby_id] = {
            "round": round_data,
            "guesses": {} # user_id -> {correct: bool, score: int}
        }
        
        return round_data

    @staticmethod
    def process_guess(db: Session, lobby_id: str, user_id: int, selected_index: int):
        game_state = MultiplayerService.active_games.get(lobby_id)
        if not game_state:
            return None
            
        if user_id in game_state["guesses"]:
            return None # Already guessed
            
        round_data = game_state["round"]
        is_correct = (selected_index == round_data["correct_index"])
        
        # Calculate score (100 base - time penalty?)
        # Simple: 100 for correct, 0 for wrong
        score_added = 100 if is_correct else 0
        
        # Update DB score
        player = db.query(LobbyPlayer).filter(LobbyPlayer.lobby_id == lobby_id, LobbyPlayer.user_id == user_id).first()
        if player:
            player.score += score_added
            db.commit()
            
        game_state["guesses"][user_id] = {
            "is_correct": is_correct,
            "score_added": score_added
        }
        
        return {
            "user_id": user_id,
            "is_correct": is_correct,
            "score_total": player.score if player else 0,
            "all_guessed": len(game_state["guesses"]) >= len(db.query(Lobby).filter(Lobby.id == lobby_id).first().players)
        }

    @staticmethod
    def get_lobby_status(db: Session, lobby_id: str):
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
             return None
             
        players_data = []
        for p in lobby.players:
            players_data.append({
                "user_id": p.user_id,
                "username": p.user.username,
                "is_ready": p.is_ready,
                "score": p.score,
                "is_host": (p.user_id == lobby.host_id)
            })
            
        result = {
            "lobby_id": lobby.id,
            "status": lobby.status,
            "host_id": lobby.host_id,
            "players": players_data,
            "player_count": len(players_data)
        }
        
        # Include current round if playing
        game_state = MultiplayerService.active_games.get(lobby_id)
        if game_state and game_state.get("round"):
            # Deep copy to safe mask
            import copy
            round_safe = copy.deepcopy(game_state["round"])
            # Remove secret
            if "correct_index" in round_safe:
                del round_safe["correct_index"]
            result["round"] = round_safe
            
            # Add user's guess info?
            # Maybe complicated for general status object.
            
        return result
