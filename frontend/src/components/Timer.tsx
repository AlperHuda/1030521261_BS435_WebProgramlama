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

  // Circular progress properties
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (isCritical) return '#ef4444';
    if (isWarning) return '#f59e0b';
    return '#10b981';
  };

  const getGradientId = () => {
    if (isCritical) return 'timer-critical';
    if (isWarning) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '24px'
      }}
    >
      {/* Circular Timer */}
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="timer-normal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="timer-warning" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="timer-critical" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Center time display */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: '700',
            color: getColor(),
            transition: 'color 0.3s',
            lineHeight: 1
          }}>
            {timeLeft}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            saniye
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={getColor()}
            strokeWidth="2"
            style={{ transition: 'stroke 0.3s' }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '16px' }}>
            Kalan Süre
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${getColor()}, ${isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#34d399'})`,
            transition: 'width 0.5s linear, background 0.3s',
            borderRadius: '4px'
          }} />
        </div>

        {/* Status message */}
        <p style={{
          fontSize: '14px',
          color: isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#94a3b8',
          transition: 'color 0.3s',
          margin: 0
        }}>
          {isCritical
            ? '⚠️ Acele edin! Süre bitiyor!'
            : isWarning
              ? '⏰ Son 10 saniye!'
              : '🎯 Dikkatli düşünün ve seçiminizi yapın'
          }
        </p>
      </div>
    </div>
  );
}
