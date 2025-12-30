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
      <div
        className="glass-card animate-scale-in"
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          padding: '48px 40px',
        }}
      >
        {/* Result Icon */}
        <div
          className="animate-float"
          style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            background: correct
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: correct
              ? '0 20px 60px rgba(16, 185, 129, 0.4)'
              : '0 20px 60px rgba(239, 68, 68, 0.4)',
          }}
        >
          {correct ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          background: correct
            ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {correct ? '🎉 Tebrikler!' : '😔 Tekrar Deneyin'}
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        {/* Stats Card */}
        <div style={{
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          marginBottom: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* AI Image Index */}
          {aiImageIndex !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                AI Görseli
              </span>
              <span style={{
                fontWeight: '700',
                fontSize: '18px',
                color: '#8b5cf6'
              }}>
                Görsel #{aiImageIndex + 1}
              </span>
            </div>
          )}

          {/* Time Taken */}
          {timeTaken !== null && timeTaken !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Süre
              </span>
              <span style={{
                fontWeight: '700',
                fontSize: '18px',
                color: '#f59e0b'
              }}>
                {timeTaken.toFixed(1)} saniye
              </span>
            </div>
          )}

          {/* Attempt Result */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
          }}>
            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Sonuç
            </span>
            <span style={{
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              background: correct
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
              color: correct ? '#34d399' : '#f87171'
            }}>
              {correct && attemptNumber === 1 && '⭐ İlk Denemede!'}
              {correct && attemptNumber === 2 && '✓ İkinci Denemede'}
              {!correct && '✗ Başarısız'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="button"
            onClick={onPlayAgain}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Yeni Tur
          </button>

          {gameMode === 'timed' && onViewLeaderboard && (
            <button
              className="button"
              onClick={onViewLeaderboard}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M3 6h.01" />
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
              </svg>
              Sıralama Tablosu
            </button>
          )}

          <button
            className="button button-secondary"
            onClick={onBackToMenu}
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Ana Menü
          </button>
        </div>
      </div>
    </div>
  );
}
