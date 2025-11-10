import { useState, useEffect } from 'react';
import { api, StatsResponse } from '../services/api';

type StatsScreenProps = {
  onBack: () => void;
};

export function StatsScreen({ onBack }: StatsScreenProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>İstatistikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>{error || 'İstatistikler yüklenemedi'}</p>
          <button className="button" onClick={onBack} style={{ marginTop: '16px' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const accuracyPercent = (stats.accuracy * 100).toFixed(1);

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="title">İstatistikler</h2>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div className="content" style={{ padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>
              {stats.total_rounds}
            </div>
            <div className="text">Toplam Oyun</div>
          </div>
        </div>

        <div className="card">
          <div className="content" style={{ padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#16a34a' }}>
              {accuracyPercent}%
            </div>
            <div className="text">Doğruluk Oranı</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#16a34a' }}>
                {stats.correct_first_attempt}
              </div>
              <div className="text" style={{ fontSize: '12px' }}>İlk Denemede</div>
            </div>
          </div>

          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#2563eb' }}>
                {stats.correct_second_attempt}
              </div>
              <div className="text" style={{ fontSize: '12px' }}>İkinci Denemede</div>
            </div>
          </div>

          <div className="card">
            <div className="content" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626' }}>
                {stats.failed}
              </div>
              <div className="text" style={{ fontSize: '12px' }}>Başarısız</div>
            </div>
          </div>
        </div>
      </div>

      <button className="button" onClick={onBack}>
        Ana Menüye Dön
      </button>
    </div>
  );
}

