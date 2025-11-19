import { useState, useEffect } from 'react';

type TimerProps = {
  timeLimit: number;
  onTimeUp: () => void;
  isPaused?: boolean;
};

export function Timer({ timeLimit, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeUp]);

  const percentage = (timeLeft / timeLimit) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontWeight: 600 }}>Kalan Süre</span>
        <span
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: isCritical ? '#dc2626' : isWarning ? '#f59e0b' : '#16a34a',
          }}
        >
          {timeLeft}s
        </span>
      </div>
      <div
        style={{
          height: '12px',
          background: '#e5e7eb',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: isCritical ? '#dc2626' : isWarning ? '#f59e0b' : '#16a34a',
            transition: 'width 0.3s linear, background 0.3s',
          }}
        />
      </div>
    </div>
  );
}

