type MenuScreenProps = {
  onStartGame: () => void;
  onViewStats: () => void;
  onViewAchievements?: () => void;
  onSettings?: () => void;
  onLogin?: () => void;
  onProfile?: () => void;
  onMultiplayer?: () => void;
  isAuthenticated?: boolean;
  username?: string;
};

export function MenuScreen({
  onStartGame,
  onViewStats,
  onViewAchievements,
  onSettings,
  onLogin,
  onProfile,
  onMultiplayer,
  isAuthenticated,
  username
}: MenuScreenProps) {
  return (
    <div className="center">
      <div className="glass-card" style={{
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Logo/Icon */}
        <div className="animate-float" style={{ marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          AI Görsel Tahmin
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          marginBottom: '32px',
          fontWeight: '400'
        }}>
          Yapay zeka ile gerçeği ayırt et!
        </p>

        {/* Welcome Message */}
        {isAuthenticated && username && (
          <div className="animate-slide-up" style={{
            padding: '12px 20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <span style={{ color: '#10b981', fontWeight: '500' }}>
              👋 Hoş geldin, {username}!
            </span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Start Game - Main CTA */}
          <button
            className="button animate-glow"
            onClick={onStartGame}
            style={{
              width: '100%',
              fontSize: '18px',
              padding: '16px 28px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Oyuna Başla
          </button>

          {/* Stats */}
          <button
            className="button button-secondary"
            onClick={onViewStats}
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            İstatistikler
          </button>

          {/* Achievements */}
          {onViewAchievements && (
            <button
              className="button"
              onClick={onViewAchievements}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              Rozetlerim
            </button>
          )}

          {/* Multiplayer */}
          {onMultiplayer && (
            <button
              className="button"
              onClick={onMultiplayer}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Çok Oyunculu
            </button>
          )}

          {/* Profile */}
          {onProfile && (
            <button
              className="button"
              onClick={onProfile}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profilim
            </button>
          )}

          {/* Settings */}
          {onSettings && (
            <button
              className="button button-secondary"
              onClick={onSettings}
              style={{ width: '100%' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Ayarlar
            </button>
          )}

          {/* Login Button */}
          {!isAuthenticated && onLogin && (
            <button
              className="button"
              onClick={onLogin}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Giriş Yap / Kayıt Ol
            </button>
          )}
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '32px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          © 2024 AI Görsel Tahmin Oyunu
        </p>
      </div>
    </div>
  );
}
