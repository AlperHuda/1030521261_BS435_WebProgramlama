type MenuScreenProps = {
  onStartGame: () => void;
  onViewStats: () => void;
  onViewAchievements?: () => void;
  onLogin?: () => void;
  onProfile?: () => void;
  isAuthenticated?: boolean;
  username?: string;
};

export function MenuScreen({ onStartGame, onViewStats, onViewAchievements, onLogin, onProfile, isAuthenticated, username }: MenuScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="title" style={{ fontSize: '36px', marginBottom: '16px' }}>
          AI Görsel Tahmin Oyunu
        </h1>

        {isAuthenticated && username && (
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            Hoş geldin, {username}!
          </p>
        )}

        <div className="text" style={{ marginBottom: '32px', lineHeight: '1.6' }}>
          <p>Yapay zeka ile gerçeği ayırt etme becerilerinizi test edin!</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
          <button
            className="button"
            onClick={onStartGame}
            style={{ fontSize: '18px', padding: '14px 24px' }}
          >
            Oyuna Başla
          </button>

          <button
            className="button"
            onClick={onViewStats}
            style={{ fontSize: '16px', padding: '12px 24px', background: '#6b7280' }}
          >
            İstatistikler
          </button>

          {isAuthenticated && onViewAchievements && (
            <button
              className="button"
              onClick={onViewAchievements}
              style={{ fontSize: '16px', padding: '12px 24px', background: '#eab308' }}
            >
              Rozetlerim
            </button>
          )}

          {isAuthenticated && onProfile && (
            <button
              className="button"
              onClick={onProfile}
              style={{ fontSize: '16px', padding: '12px 24px', background: '#16a34a' }}
            >
              Profilim
            </button>
          )}

          {!isAuthenticated && onLogin && (
            <button
              className="button"
              onClick={onLogin}
              style={{ fontSize: '16px', padding: '12px 24px', background: '#2563eb' }}
            >
              Giriş Yap / Kayıt Ol
            </button>
          )}
        </div>

        <div style={{ marginTop: '48px', fontSize: '14px', color: '#6b7280' }}>
          <p>Hafta 5: Başarı Rozetleri ve Gamification</p>
        </div>
      </div>
    </div>
  );
}

