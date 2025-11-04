type ErrorDisplayProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="center">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="title" style={{ color: '#dc2626' }}>Hata</h2>
        <p className="text">{message}</p>
        <button className="button" onClick={onRetry} style={{ marginTop: '16px' }}>
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}

