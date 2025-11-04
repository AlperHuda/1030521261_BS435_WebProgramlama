type StartScreenProps = {
  onStart: () => void;
  isLoading?: boolean;
};

export function StartScreen({ onStart, isLoading = false }: StartScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="title" style={{ fontSize: '32px', marginBottom: '16px' }}>
          AI Görsel Tahmin Oyunu
        </h1>
        <div className="text" style={{ marginBottom: '24px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>
            Karşınıza çıkacak üç görselden hangisinin yapay zekâ tarafından üretildiğini tahmin edin!
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>Kurallar:</strong>
          </p>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>İlk tahmininizde yanlış yaparsanız ipucu alırsınız</li>
            <li>İkinci bir tahmin hakkınız daha vardır</li>
            <li>Detaylara dikkat edin: yüz simetrisi, arka plan, gölgeler</li>
          </ul>
        </div>
        <button
          className="button"
          onClick={onStart}
          disabled={isLoading}
          style={{ fontSize: '18px', padding: '12px 32px' }}
        >
          {isLoading ? 'Yükleniyor...' : 'Başla'}
        </button>
      </div>
    </div>
  );
}
