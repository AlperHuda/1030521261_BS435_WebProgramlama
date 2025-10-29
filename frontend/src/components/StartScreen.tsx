type StartScreenProps = { onStart: () => void };

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="title">AI Görsel Tahmin Oyunu</h1>
        <p className="text">Üç görselden hangisinin yapay zekâ tarafından üretildiğini tahmin edin.</p>
        <button className="button" onClick={onStart}>Başla</button>
      </div>
    </div>
  );
}
