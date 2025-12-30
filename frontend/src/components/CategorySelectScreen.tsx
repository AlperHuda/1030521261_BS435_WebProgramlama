import { useState, useEffect } from 'react';
import { api, Category } from '../services/api';

type CategorySelectScreenProps = {
  onSelectCategory: (categoryName: string | null) => void;
  onBack: () => void;
  isLoading?: boolean;
};

const categoryIcons: Record<string, JSX.Element> = {
  landscape: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  ),
  nature: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V2" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <path d="M8 7.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.5a5 5 0 0 1-10 0v-.5z" />
    </svg>
  ),
  'sci-fi': (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  art: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  fantasy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  historical: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01" />
      <path d="M9 12v.01" />
      <path d="M9 15v.01" />
    </svg>
  ),
  sports: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

export function CategorySelectScreen({ onSelectCategory, onBack, isLoading = false }: CategorySelectScreenProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.listCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kategoriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="glass-card animate-fade-in" style={{ padding: '48px', textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px' }} />
          <p style={{ color: '#94a3b8' }}>Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#f87171'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p style={{ color: '#f87171', marginBottom: '24px' }}>{error}</p>
          <button className="button button-secondary" onClick={onBack}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '40px' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 12, 41, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            animation: 'pulse 2s infinite'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
            AI Görseli Hazırlanıyor...
          </h2>
          <p style={{ color: '#94a3b8' }}>Yapay zeka sahneyi oluştururken lütfen bekleyin</p>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          📁 Kategori Seçin
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>
          Bir kategori seçin veya rastgele oynayın
        </p>
      </div>

      {/* Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Random Option */}
        <div
          className="glass-card animate-scale-in"
          style={{
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            opacity: isLoading ? 0.5 : 1
          }}
          onClick={() => !isLoading && onSelectCategory(null)}
        >
          <div style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>
              🎲 Rastgele
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              Tüm kategorilerden
            </p>
          </div>
        </div>

        {/* Categories */}
        {categories.map((category, idx) => (
          <div
            key={category.id}
            className="glass-card animate-scale-in"
            style={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: isLoading ? 0.5 : 1,
              animationDelay: `${(idx + 1) * 50}ms`
            }}
            onClick={() => !isLoading && onSelectCategory(category.name)}
          >
            <div style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a855f7'
              }}>
                {categoryIcons[category.name] || (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                )}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>
                {category.display_name}
              </h3>
              {category.description && (
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        className="button button-secondary"
        onClick={onBack}
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.5 : 1 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Geri Dön
      </button>
    </div>
  );
}
