import { useState, useEffect } from 'react';
import { api, LobbyStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

type LobbyScreenProps = {
    onBack: () => void;
    onGameStart: (lobbyId: string) => void;
};

export function LobbyScreen({ onBack, onGameStart }: LobbyScreenProps) {
    const { token, user } = useAuth();
    const [lobbyId, setLobbyId] = useState('');
    const [currentLobby, setCurrentLobby] = useState<LobbyStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // WebSocket
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Cleanup WebSocket on unmount
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    const connectWebSocket = (id: string) => {
        if (!token || !user) return;

        // In dev: ws://localhost:8000
        // In prod: wss://your-domain
        const wsUrl = `ws://localhost:8000/multiplayer/ws/${id}/${user.id}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("Connected to Lobby WS");
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'LOBBY_UPDATE') {
                setCurrentLobby(message.data);
                if (message.data.status === 'PLAYING') {
                    onGameStart(message.data.lobby_id);
                }
            } else if (message.type === 'GAME_START') {
                onGameStart(message.lobby_id);
            }
        };

        setWs(socket);
    };

    const handleCreateLobby = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.createLobby(token);
            setLobbyId(data.lobby_id);

            // Fetch initial status
            const status = await api.getLobby(token, data.lobby_id);
            setCurrentLobby(status);

            connectWebSocket(data.lobby_id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create lobby');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLobby = async () => {
        if (!token || !lobbyId) return;
        setLoading(true);
        setError(null);
        try {
            await api.joinLobby(token, lobbyId);
            const status = await api.getLobby(token, lobbyId);
            setCurrentLobby(status);

            connectWebSocket(lobbyId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to join lobby');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleReady = async () => {
        if (!token || !lobbyId) return;
        try {
            await api.toggleReady(token, lobbyId);
            // WS will update state
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartGame = async () => {
        if (!token || !lobbyId) return;
        try {
            await api.startLobby(token, lobbyId);
            onGameStart(lobbyId);
        } catch (err) {
            setError('Failed to start game');
        }
    };

    const isHost = currentLobby && user && currentLobby.host_id === user.id;
    const amIReady = currentLobby?.players.find(p => p.user_id === user?.id)?.is_ready;

    if (currentLobby) {
        return (
            <div className="container">
                <h2 className="title">Lobby: {currentLobby.lobby_id}</h2>
                <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                    <h3>Oyuncular ({currentLobby.player_count})</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {currentLobby.players.map(p => (
                            <li key={p.user_id} style={{ padding: '8px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{p.username} {p.is_host && '(HOST)'} {p.user_id === user?.id && '(SEN)'}</span>
                                <span style={{ color: p.is_ready ? 'green' : 'gray' }}>{p.is_ready ? 'Hazır' : 'Bekliyor'}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="button" style={{ backgroundColor: '#dc2626' }} onClick={onBack}>Çıkış</button>

                    {isHost ? (
                        <button
                            className="button"
                            style={{
                                background: currentLobby.player_count < 2 ? 'gray' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                cursor: currentLobby.player_count < 2 ? 'not-allowed' : 'pointer'
                            }}
                            disabled={currentLobby.player_count < 2}
                            onClick={handleStartGame}
                        >
                            Oyunu Başlat ({currentLobby.player_count}/2)
                        </button>
                    ) : (
                        <button
                            className="button"
                            style={{ background: amIReady ? '#d97706' : '#2563eb' }}
                            onClick={handleToggleReady}
                        >
                            {amIReady ? 'İptal Et' : 'Hazır Ol'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="title">Multiplayer Lobby</h2>

            <div className="card" style={{ padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
                <button
                    className="button"
                    onClick={handleCreateLobby}
                    disabled={loading}
                    style={{ width: '100%', marginBottom: '24px' }}
                >
                    {loading ? 'Yükleniyor...' : 'Yeni Oda Oluştur'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                    <span style={{ padding: '0 10px', color: '#6b7280' }}>VEYA</span>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Oda Kodu</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={lobbyId}
                            onChange={(e) => setLobbyId(e.target.value.toUpperCase())}
                            placeholder="6 Haneli Kod"
                            className="input"
                            maxLength={6}
                        />
                        <button
                            className="button"
                            onClick={handleJoinLobby}
                            disabled={loading || lobbyId.length < 6}
                        >
                            Katıl
                        </button>
                    </div>
                </div>

                {error && <p style={{ color: '#dc2626', marginTop: '16px', fontSize: '14px' }}>{error}</p>}
            </div>

            <button className="button" onClick={onBack} style={{ background: '#6b7280', marginTop: '24px' }}>
                Geri Dön
            </button>
        </div>
    );
}
