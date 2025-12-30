import { useState, useEffect } from 'react';
import { api, GameMode } from '../services/api';

type ModeSelectScreenProps = {
  onSelectMode: (modeName: string) => void;
  onBack: () => void;
};

const modeIcons: Record<string, { icon: JSX.Element; gradient: string }> = {
  classic: {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
  },
  timed: {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  time_attack: {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  zen: {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  }
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
        setError(err instanceof Error ? err.message : 'Oyun modları yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    fetchModes();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="glass-card animate-fade-in" style={{ padding: '48px', textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px' }} />
          <p style={{ color: '#94a3b8' }}>Oyun modları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#f87171'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p style={{ color: '#f87171', marginBottom: '24px' }}>{error}</p>
          <button className="button button-secondary" onClick={onBack}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🎮 Oyun Modu Seçin
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>
          Nasıl oynamak istediğinizi seçin
        </p>
      </div>

      {/* Mode Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {modes.map((mode, idx) => {
          const modeStyle = modeIcons[mode.name] || {
            icon: (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ),
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
          };

          return (
            <div
              key={mode.id}
              className="glass-card animate-scale-in"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                animationDelay: `${idx * 100}ms`
              }}
              onClick={() => onSelectMode(mode.name)}
            >
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: modeStyle.gradient,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                    boxShadow: `0 10px 30px ${mode.name === 'classic' ? 'rgba(139, 92, 246, 0.3)' : mode.name === 'timed' ? 'rgba(245, 158, 11, 0.3)' : mode.name === 'time_attack' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                  }}>
                    {modeStyle.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#f8fafc',
                      marginBottom: '8px'
                    }}>
                      {mode.display_name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
                      {mode.description}
                    </p>
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
