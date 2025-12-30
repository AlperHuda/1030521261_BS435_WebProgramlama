type GameBoardProps = {
  images: Array<{ id: number; url: string }>;
  onSelect: (index: number) => void;
  hint: string | null;
  isLoading?: boolean;
  attemptNumber?: number;
  selectedIndex: number | null;
};

export function GameBoard({
  images,
  onSelect,
  hint,
  isLoading = false,
  attemptNumber = 0,
  selectedIndex,
}: GameBoardProps) {
  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-slide-up">
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          background: attemptNumber <= 1
            ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px'
        }}>
          {attemptNumber <= 1 ? '🎯 Hangi Görsel AI Tarafından Üretildi?' : '🔄 İkinci Şansınız!'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>
          Görselleri inceleyin ve yapay zeka tarafından üretileni bulun
        </p>
      </div>

      {/* Hint Box */}
      {hint && (
        <div
          className="animate-fade-in glass-card"
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>💡 İpucu</strong>
            <span style={{ color: '#fcd34d' }}>{hint}</span>
          </div>
        </div>
      )}

      {/* Second Attempt Warning */}
      {attemptNumber > 1 && (
        <div
          className="animate-fade-in"
          style={{
            padding: '16px 20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <span style={{ color: '#f87171' }}>
            ⚠️ İlk tahmininiz yanlıştı. İpucunu kullanarak tekrar deneyin!
          </span>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid" style={{ gap: '24px' }}>
        {images.map((image, idx) => {
          const isDisabled = isLoading || (attemptNumber > 1 && idx === selectedIndex);
          const wasSelected = attemptNumber > 1 && idx === selectedIndex;

          return (
            <div
              key={image.id}
              className="animate-scale-in"
              style={{
                animationDelay: `${idx * 100}ms`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              <div
                className="card"
                style={{
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: wasSelected ? 0.6 : 1,
                  ...(wasSelected ? {
                    border: '2px solid rgba(239, 68, 68, 0.5)',
                    transform: 'scale(0.98)'
                  } : {})
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={image.url}
                    alt={`Görsel ${idx + 1}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />

                  {/* Image Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '36px',
                    height: '36px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: 'white'
                  }}>
                    {idx + 1}
                  </div>

                  {/* Wrong Selection Overlay */}
                  {wasSelected && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px' }}>
                  <button
                    className="button"
                    onClick={() => onSelect(idx)}
                    disabled={isDisabled}
                    style={{
                      width: '100%',
                      background: wasSelected
                        ? 'rgba(107, 114, 128, 0.5)'
                        : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" />
                        </svg>
                        Değerlendiriliyor...
                      </>
                    ) : wasSelected ? (
                      '❌ Yanlış Tahmin'
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Bu Görseli Seç
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
