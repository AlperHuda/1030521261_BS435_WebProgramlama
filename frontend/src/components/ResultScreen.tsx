type ResultScreenProps = {
  correct: boolean;
  message: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  aiImageIndex: number | null;
  attemptNumber: number;
};

export function ResultScreen({
  correct,
  message,
  onPlayAgain,
  onBackToMenu,
  aiImageIndex,
  attemptNumber,
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

        {aiImageIndex !== null && (
          <div
            style={{
              padding: '16px',
              background: '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '24px',
            }}
          >
            <p className="text">
              <strong>AI Görseli:</strong> Görsel #{aiImageIndex + 1}
            </p>
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
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="button" onClick={onPlayAgain}>
            Yeni Tur
          </button>
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
