import { useState, useEffect } from 'react';
import { api, Category } from '../services/api';

type CategorySelectScreenProps = {
  onSelectCategory: (categoryName: string | null) => void;
  onBack: () => void;
  isLoading?: boolean;
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
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button className="button" onClick={onBack} style={{ marginTop: '16px' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: 'white'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>AI Görseli Hazırlanıyor...</h2>
          <p style={{ marginTop: '10px', opacity: 0.8 }}>Yapay zeka sahneyi oluştururken lütfen bekleyin.</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <h2 className="title">Kategori Seçin</h2>

      <p className="text" style={{ marginBottom: '24px' }}>
        Bir kategori seçin veya rastgele oynayın
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div
          className="card"
          style={{ cursor: 'pointer', transition: 'transform 0.2s', background: '#f3f4f6' }}
          onClick={() => !isLoading && onSelectCategory(null)}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Rastgele</h3>
            <p className="text" style={{ fontSize: '14px', marginTop: '8px' }}>
              Tüm kategorilerden
            </p>
          </div>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className="card"
            style={{ cursor: 'pointer', transition: 'transform 0.2s', opacity: isLoading ? 0.5 : 1 }}
            onClick={() => !isLoading && onSelectCategory(category.name)}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div className="content" style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                {category.display_name}
              </h3>
              {category.description && (
                <p className="text" style={{ fontSize: '14px', marginTop: '8px' }}>
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="button" onClick={onBack} disabled={isLoading} style={{ background: '#6b7280', opacity: isLoading ? 0.5 : 1 }}>
        Geri Dön
      </button>
    </div>
  );
}

