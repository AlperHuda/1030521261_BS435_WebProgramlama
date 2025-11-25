import { useState } from 'react';

type RegisterScreenProps = {
  onRegister: (username: string, password: string, email?: string, displayName?: string) => Promise<void>;
  onSwitchToLogin: () => void;
  onBack: () => void;
};

export function RegisterScreen({ onRegister, onSwitchToLogin, onBack }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onRegister(username, password, email || undefined, displayName || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <div className="container" style={{ maxWidth: '400px' }}>
        <h2 className="title" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Kayıt Ol
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Kullanıcı Adı *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
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
              Şifre * (en az 6 karakter)
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              E-posta (opsiyonel)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Görünen Ad (opsiyonel)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginBottom: '16px' }}>
          Zaten hesabınız var mı?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#2f6feb',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Giriş Yap
          </button>
        </p>

        <button className="button" onClick={onBack} style={{ width: '100%', background: '#6b7280' }}>
          Ana Menüye Dön
        </button>
      </div>
    </div>
  );
}

