type GameBoardProps = {
  images: string[];
  onSelect: (index: number) => void;
  hint: string | null;
};

export function GameBoard({ images, onSelect, hint }: GameBoardProps) {
  return (
    <div className="container">
      <h2 className="title">Görseli Seçin</h2>
      {hint && <p className="text">İpucu: {hint}</p>}
      <div className="grid">
        {images.map((src, idx) => (
          <div className="card" key={idx}>
            <img src={src} alt={`Görsel ${idx + 1}`} />
            <div className="content">
              <button className="button" onClick={() => onSelect(idx)}>Bu görseli seç</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
