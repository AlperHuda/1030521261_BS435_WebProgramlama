type MenuScreenProps = {
  onStartGame: () => void;
  onViewStats: () => void;
};

export function MenuScreen({ onStartGame, onViewStats }: MenuScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="title" style={{ fontSize: '36px', marginBottom: '24px' }}>
          AI Görsel Tahmin Oyunu
        </h1>
        
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
        </div>

        <div style={{ marginTop: '48px', fontSize: '14px', color: '#6b7280' }}>
          <p>Hafta 2: Klasik Mod + Kategori Sistemi</p>
        </div>
      </div>
    </div>
  );
}

