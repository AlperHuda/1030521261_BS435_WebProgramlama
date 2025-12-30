import { useState, useEffect } from 'react';
import { api, LeaderboardEntry } from '../services/api';

type LeaderboardScreenProps = {
  onBack: () => void;
  gameMode?: string;
};

export function LeaderboardScreen({ onBack, gameMode = 'timed' }: LeaderboardScreenProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await api.getTopByMode(gameMode, 10);
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sıralama yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [gameMode]);

  if (loading) {
    return (
      <div className="center">
        <div className="glass-card animate-fade-in" style={{ padding: '48px', textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px' }} />
          <p style={{ color: '#94a3b8' }}>Sıralama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || entries.length === 0) {
    return (
      <div className="center">
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: error ? '#f87171' : '#a855f7'
          }}>
            {error ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M3 6h.01" />
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
              </svg>
            )}
          </div>
          <p style={{ color: error ? '#f87171' : '#94a3b8', marginBottom: '24px' }}>
            {error || 'Henüz skor kaydedilmemiş'}
          </p>
          <button className="button button-secondary" onClick={onBack}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1a1a3e', shadow: 'rgba(251, 191, 36, 0.4)' };
    if (rank === 2) return { bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', color: '#1a1a3e', shadow: 'rgba(148, 163, 184, 0.4)' };
    if (rank === 3) return { bg: 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)', color: 'white', shadow: 'rgba(205, 127, 50, 0.4)' };
    return { bg: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', shadow: 'transparent' };
  };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
        <div style={{
          width: '70px',
          height: '70px',
          margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🏆 Sıralama Tablosu
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>
          {gameMode === 'timed' ? 'Zamana Karşı Mod' : 'Klasik Mod'}
        </p>
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {entries.map((entry, idx) => {
          const rankStyle = getRankStyle(entry.rank);

          return (
            <div
              key={entry.id}
              className="glass-card animate-scale-in"
              style={{
                animationDelay: `${idx * 50}ms`,
                border: entry.rank <= 3 ? `1px solid ${entry.rank === 1 ? 'rgba(251, 191, 36, 0.3)' : entry.rank === 2 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(205, 127, 50, 0.3)'}` : undefined
              }}
            >
              <div style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Rank Badge */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: rankStyle.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '18px',
                    color: rankStyle.color,
                    boxShadow: `0 4px 15px ${rankStyle.shadow}`
                  }}>
                    {entry.rank <= 3 ? (
                      entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      entry.rank
                    )}
                  </div>

                  {/* Player Info */}
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#f8fafc' }}>
                      {entry.player_name}
                    </div>
                    {entry.category && (
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {entry.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score & Time */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: '700',
                    fontSize: '20px',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'flex-end'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {entry.score} puan
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'flex-end',
                    marginTop: '4px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {entry.time_taken.toFixed(1)}s
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <button className="button button-secondary" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Geri Dön
      </button>
    </div>
  );
}
