
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GameBoard } from './GameBoard';
import { api } from '../services/api';

type MultiplayerGameScreenProps = {
    lobbyId: string;
    onBack: () => void;
};

type RoundData = {
    round_number: number;
    images: { id: number; url: string }[];
    scenario_prompt: string;
    time_limit: number;
    start_time: number;
};

type PlayerScore = {
    user_id: number;
    username: string;
    score: number;
};

export function MultiplayerGameScreen({ lobbyId, onBack }: MultiplayerGameScreenProps) {
    const { token, user } = useAuth();
    const [roundData, setRoundData] = useState<RoundData | null>(null);
    const [players, setPlayers] = useState<PlayerScore[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [roundResult, setRoundResult] = useState<{ correct_index: number } | null>(null);
    const [message, setMessage] = useState<string>('Bağlanılıyor...');

    // WebSocket
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Initial fetch to get state if joining late or refreshed
        const fetchInitialState = async () => {
            if (token) {
                try {
                    const status = await api.getLobby(token, lobbyId);
                    if (status.round) {
                        setRoundData(status.round);
                    }
                    setPlayers(status.players);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        fetchInitialState();

        // WS Connection
        if (token && user) {
            const wsUrl = `ws://localhost:8000/multiplayer/ws/${lobbyId}/${user.id}`;
            const socket = new WebSocket(wsUrl);
            ws.current = socket;

            socket.onopen = () => {
                setMessage('');
            };

            socket.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                if (msg.type === 'NEW_ROUND' || (msg.type === 'GAME_START' && msg.round)) {
                    setRoundData(msg.data || msg.round);
                    setSelectedIndex(null);
                    setRoundResult(null);
                    setMessage('');
                } else if (msg.type === 'PLAYER_UPDATE') {
                    // Update specific player score
                    setPlayers(prev => prev.map(p =>
                        p.user_id === msg.user_id ? { ...p, score: msg.score } : p
                    ));
                } else if (msg.type === 'ROUND_RESULT') {
                    setRoundResult({ correct_index: msg.correct_index });
                    setPlayers(msg.scores); // Sync full scores
                    setMessage('Sonuçlar... Yeni tur başlıyor...');
                } else if (msg.type === 'GAME_OVER') {
                    setMessage('Oyun Bitti!');
                    // SHow final scoreboard?
                } else if (msg.type === 'LOBBY_UPDATE') {
                    // Initial update or sync
                    if (msg.data.players) setPlayers(msg.data.players);
                }
            };

            socket.onclose = () => {
                setMessage('Bağlantı kesildi.');
            };

            return () => {
                socket.close();
            };
        }
    }, [lobbyId, token, user]);

    const handleSelect = (index: number) => {
        if (selectedIndex !== null) return; // Only one guess allowed per round in multiplayer?
        setSelectedIndex(index);

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'GUESS',
                index: index
            }));
        }
    };

    if (!roundData) {
        return (
            <div className="container center">
                <h2>{message || 'Oyun Yükleniyor...'}</h2>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Multiplayer Header / Scoreboard */}
            <div className="card" style={{ padding: '10px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>Tur: {roundData.round_number}</div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {players.map(p => (
                        <div key={p.user_id} style={{
                            background: p.user_id === user?.id ? '#e0f2fe' : '#f3f4f6',
                            padding: '4px 8px', borderRadius: '6px',
                            border: p.user_id === user?.id ? '1px solid #38bdf8' : 'none'
                        }}>
                            {p.username}: <strong>{p.score}</strong>
                        </div>
                    ))}
                </div>
                <button className="button" style={{ fontSize: '12px', padding: '4px 8px', background: '#ef4444' }} onClick={onBack}>Çık</button>
            </div>

            {/* Message Overlay */}
            {message && roundResult && (
                <div style={{ textAlign: 'center', margin: '10px', color: '#f59e0b', fontWeight: 'bold' }}>
                    {message}
                </div>
            )}

            <GameBoard
                images={roundData.images}
                onSelect={handleSelect}
                hint={null} // No hints in multiplayer for now
                isLoading={false}
                attemptNumber={1} // Force attempt 1 visual style
                selectedIndex={selectedIndex}
            />

            {/* Result Overlay */}
            {roundResult && (
                <div style={{
                    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 20px', borderRadius: '20px',
                    zIndex: 100
                }}>
                    Doğru Cevap: {roundResult.correct_index + 1}. Görsel
                </div>
            )}
        </div>
    );
}
