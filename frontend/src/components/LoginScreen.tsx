import { useState } from 'react';

type LoginScreenProps = {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onBack: () => void;
};

export function LoginScreen({ onLogin, onSwitchToRegister, onBack }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <div className="container" style={{ maxWidth: '400px' }}>
        <h2 className="title" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Giriş Yap
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '12px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginBottom: '16px' }}>
          Hesabınız yok mu?{' '}
          <button
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#2f6feb',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Kayıt Ol
          </button>
        </p>

        <button className="button" onClick={onBack} style={{ width: '100%', background: '#6b7280' }}>
          Ana Menüye Dön
        </button>
      </div>
    </div>
  );
}

