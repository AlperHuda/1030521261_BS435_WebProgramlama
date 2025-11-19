import { useState } from 'react';

type PlayerNameModalProps = {
  onSubmit: (name: string) => void;
  onSkip: () => void;
};

export function PlayerNameModal({ onSubmit, onSkip }: PlayerNameModalProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <div className="content" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            Skorunuzu Kaydedin
          </h3>
          <p className="text" style={{ marginBottom: '16px' }}>
            Sıralama tablosuna girmek için isminizi girin
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="İsminiz"
              maxLength={100}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '16px',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="button"
                disabled={!name.trim()}
                style={{ flex: 1 }}
              >
                Kaydet
              </button>
              <button
                type="button"
                className="button"
                onClick={onSkip}
                style={{ flex: 1, background: '#6b7280' }}
              >
                Atla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

