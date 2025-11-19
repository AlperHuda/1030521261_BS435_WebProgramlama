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
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [gameMode]);

  if (loading) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>Sıralama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || entries.length === 0) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>{error || 'Henüz skor yok'}</p>
          <button className="button" onClick={onBack} style={{ marginTop: '16px' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="title">Sıralama Tablosu</h2>
      <p className="text" style={{ marginBottom: '24px' }}>
        {gameMode === 'timed' ? 'Zamana Karşı Mod' : 'Klasik Mod'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {entries.map((entry) => (
          <div key={entry.id} className="card">
            <div
              className="content"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background:
                      entry.rank === 1
                        ? '#fbbf24'
                        : entry.rank === 2
                        ? '#94a3b8'
                        : entry.rank === 3
                        ? '#cd7f32'
                        : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {entry.rank}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{entry.player_name}</div>
                  {entry.category && (
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{entry.category}</div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#16a34a' }}>
                  {entry.score} puan
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {entry.time_taken.toFixed(1)}s
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="button" onClick={onBack}>
        Geri Dön
      </button>
    </div>
  );
}

