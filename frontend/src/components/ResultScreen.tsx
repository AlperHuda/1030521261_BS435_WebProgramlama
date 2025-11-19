type ResultScreenProps = {
  correct: boolean;
  message: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onViewLeaderboard?: () => void;
  aiImageIndex: number | null;
  attemptNumber: number;
  timeTaken?: number | null;
  gameMode?: string | null;
};

export function ResultScreen({
  correct,
  message,
  onPlayAgain,
  onBackToMenu,
  onViewLeaderboard,
  aiImageIndex,
  attemptNumber,
  timeTaken,
  gameMode,
}: ResultScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h2
          className="title"
          style={{
            fontSize: '28px',
            color: correct ? '#16a34a' : '#dc2626',
            marginBottom: '16px',
          }}
        >
          {correct ? 'Tebrikler!' : 'Tekrar Deneyin'}
        </h2>

        <p className="text" style={{ fontSize: '18px', marginBottom: '16px' }}>
          {message}
        </p>

        <div
          style={{
            padding: '16px',
            background: '#f3f4f6',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          {aiImageIndex !== null && (
            <p className="text" style={{ marginBottom: '8px' }}>
              <strong>AI Görseli:</strong> Görsel #{aiImageIndex + 1}
            </p>
          )}
          {timeTaken !== null && timeTaken !== undefined && (
            <p className="text" style={{ marginBottom: '8px' }}>
              <strong>Süre:</strong> {timeTaken.toFixed(1)} saniye
            </p>
          )}
          {correct && attemptNumber === 1 && (
            <p style={{ color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
              İlk denemede doğru! Harika!
            </p>
          )}
          {correct && attemptNumber === 2 && (
            <p style={{ color: '#2563eb', marginTop: '8px' }}>
              İkinci denemede başardınız!
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="button" onClick={onPlayAgain}>
            Yeni Tur
          </button>
          {gameMode === 'timed' && onViewLeaderboard && (
            <button
              className="button"
              onClick={onViewLeaderboard}
              style={{ background: '#f59e0b' }}
            >
              Sıralama
            </button>
          )}
          <button
            className="button"
            onClick={onBackToMenu}
            style={{ background: '#6b7280' }}
          >
            Ana Menü
          </button>
        </div>
      </div>
    </div>
  );
}
