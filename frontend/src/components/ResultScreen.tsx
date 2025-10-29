type ResultScreenProps = {
  correct: boolean;
  message: string;
  onPlayAgain: () => void;
};

export function ResultScreen({ correct, message, onPlayAgain }: ResultScreenProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="title">{correct ? 'Tebrikler!' : 'Tekrar deneyin'}</h2>
        <p className="text">{message}</p>
        <button className="button" onClick={onPlayAgain}>Yeni Tur</button>
      </div>
    </div>
  );
}
