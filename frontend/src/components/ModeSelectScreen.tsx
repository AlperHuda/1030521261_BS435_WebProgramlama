import { useState, useEffect } from 'react';
import { api, GameMode } from '../services/api';

type ModeSelectScreenProps = {
  onSelectMode: (modeName: string) => void;
  onBack: () => void;
};

export function ModeSelectScreen({ onSelectMode, onBack }: ModeSelectScreenProps) {
  const [modes, setModes] = useState<GameMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModes() {
      try {
        const data = await api.listGameModes();
        setModes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game modes');
      } finally {
        setLoading(false);
      }
    }
    fetchModes();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>Oyun modları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button className="button" onClick={onBack} style={{ marginTop: '16px' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Oyun Modu Seçin</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {modes.map((mode) => (
          <div
            key={mode.id}
            className="card"
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => onSelectMode(mode.name)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div className="content" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                {mode.display_name}
              </h3>
              <p className="text" style={{ fontSize: '14px' }}>
                {mode.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="button" onClick={onBack} style={{ background: '#6b7280' }}>
        Geri Dön
      </button>
    </div>
  );
}

