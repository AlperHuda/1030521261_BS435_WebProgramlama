import { useState, useEffect } from 'react';
import { api, UserStats } from '../services/api';
import { useAuth } from '../context/AuthContext';

type ProfileScreenProps = {
  onBack: () => void;
};

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      
      try {
        const data = await api.getUserStats(token);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'İstatistikler yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !user || !stats) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>{error || 'Profil yüklenemedi'}</p>
          <button className="button" onClick={onBack} style={{ marginTop: '16px' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="title">Profil</h2>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="content" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {user.display_name || user.username}
          </h3>
          <p className="text" style={{ fontSize: '14px', color: '#6b7280' }}>
            @{user.username}
          </p>
          {user.email && (
            <p className="text" style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {user.email}
            </p>
          )}
        </div>
      </div>

      <h3 className="title" style={{ marginBottom: '16px' }}>İstatistikler</h3>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div className="content" style={{ padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>
              {stats.total_games}
            </div>
            <div className="text">Toplam Oyun</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#16a34a' }}>
                {stats.games_won}
              </div>
              <div className="text" style={{ fontSize: '14px' }}>Kazanılan</div>
            </div>
          </div>

          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626' }}>
                {stats.games_lost}
              </div>
              <div className="text" style={{ fontSize: '14px' }}>Kaybedilen</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="content" style={{ padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#16a34a' }}>
              {stats.win_rate.toFixed(1)}%
            </div>
            <div className="text">Kazanma Oranı</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#2563eb' }}>
                {stats.total_score}
              </div>
              <div className="text" style={{ fontSize: '14px' }}>Toplam Skor</div>
            </div>
          </div>

          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#f59e0b' }}>
                {stats.best_time ? stats.best_time.toFixed(1) + 's' : 'N/A'}
              </div>
              <div className="text" style={{ fontSize: '14px' }}>En İyi Süre</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#6b7280' }}>
              {stats.average_score.toFixed(2)}
            </div>
            <div className="text">Ortalama Skor</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="button" onClick={onBack} style={{ flex: 1 }}>
          Geri Dön
        </button>
        <button
          className="button"
          onClick={logout}
          style={{ flex: 1, background: '#dc2626' }}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

