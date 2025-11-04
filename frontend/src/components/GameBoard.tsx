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
    <div className="container">
      <h2 className="title">
        {attemptNumber === 0 ? 'Hangi Görsel AI Tarafından Üretildi?' : 'İkinci Şansınız!'}
      </h2>

      {hint && (
        <div
          style={{
            padding: '12px 16px',
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <strong>İpucu:</strong> {hint}
        </div>
      )}

      {attemptNumber > 0 && (
        <p className="text" style={{ marginBottom: '16px' }}>
          İlk tahmininiz yanlıştı. İpucunu kullanarak tekrar deneyin!
        </p>
      )}

      <div className="grid">
        {images.map((image, idx) => (
          <div className="card" key={image.id}>
            <img src={image.url} alt={`Görsel ${idx + 1}`} />
            <div className="content">
              <button
                className="button"
                onClick={() => onSelect(idx)}
                disabled={isLoading || (attemptNumber > 0 && idx === selectedIndex)}
                style={{
                  width: '100%',
                  opacity: attemptNumber > 0 && idx === selectedIndex ? 0.5 : 1,
                }}
              >
                {isLoading ? 'Değerlendiriliyor...' : 'Bu Görseli Seç'}
              </button>
              {attemptNumber > 0 && idx === selectedIndex && (
                <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                  X İlk tahmin
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
