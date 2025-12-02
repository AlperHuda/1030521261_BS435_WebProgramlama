import { useEffect, useState } from 'react';
import { api, UserAchievement } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AchievementListProps {
    onBack: () => void;
}

const iconMap: Record<string, string> = {
    "fa-play": "▶️",
    "fa-star": "⭐",
    "fa-gamepad": "🎮",
    "fa-crown": "👑",
    "fa-trophy": "🏆",
    "fa-chart-line": "📈"
};

export function AchievementList({ onBack }: AchievementListProps) {
    const { token, user } = useAuth();
    const [achievements, setAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // First initialize (just in case, usually admin does this or on app start)
            // Then fetch
            api.initializeAchievements(token).catch(() => { }).then(() => {
                return api.getMyAchievements(token);
            }).then(data => {
                setAchievements(data);
                setLoading(false);
            }).catch(err => {
                console.error("Failed to load achievements", err);
                setLoading(false);
            });
        }
    }, [token]);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center' }}>Yükleniyor...</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Başarı Rozetleri</h1>
                <p className="subtitle">{user?.username || 'Oyuncu'} Rozetleri</p>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {achievements.length === 0 ? (
                    <div className="stat-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        <p>Henüz hiç rozet kazanmadınız. Oynamaya devam edin!</p>
                    </div>
                ) : (
                    achievements.map((ua) => (
                        <div key={ua.achievement_id} className="stat-card achievement-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {iconMap[ua.achievement.icon_name] || '🎖️'}
                            </div>
                            <h3>{ua.achievement.name}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>{ua.achievement.description}</p>
                            <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>
                                Kazanıldı: {new Date(ua.earned_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="button secondary-button" onClick={onBack} style={{ marginTop: '2rem' }}>
                Ana Menüye Dön
            </button>
        </div>
    );
}
