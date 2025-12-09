import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SettingsScreenProps {
    onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
    const { user, token, refreshUser } = useAuth();

    const [difficulty, setDifficulty] = useState(user?.preferred_difficulty || 'medium');
    const [soundEnabled, setSoundEnabled] = useState(user?.is_sound_enabled ?? true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setDifficulty(user.preferred_difficulty || 'medium');
            setSoundEnabled(user.is_sound_enabled ?? true);
        }
    }, [user]);

    const handleSave = async () => {
        if (!token) return;

        setSaving(true);
        setMessage(null);
        try {
            await api.updateSettings(token, {
                preferred_difficulty: difficulty,
                is_sound_enabled: soundEnabled
            });
            await refreshUser(); // Update local user context
            setMessage('Ayarlar kaydedildi!');
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setMessage('Kaydedilirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px' }}>
            <div className="header">
                <h1>Ayarlar</h1>
                <p className="subtitle">Oyun deneyiminizi özelleştirin</p>
            </div>

            <div className="stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Difficulty Setting */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Zorluk Seviyesi</label>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                        Varsayılan zorluk seviyesini belirleyin.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['easy', 'medium', 'hard'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`button ${difficulty === level ? 'primary' : 'secondary'}`}
                                style={{
                                    flex: 1,
                                    opacity: difficulty === level ? 1 : 0.7,
                                    background: difficulty === level ? undefined : '#f3f4f6',
                                    color: difficulty === level ? undefined : '#374151',
                                    border: difficulty === level ? undefined : '1px solid #e5e7eb'
                                }}
                            >
                                {level === 'easy' ? 'Kolay' : level === 'medium' ? 'Orta' : 'Zor'}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        {difficulty === 'easy' ? '3 ipucu hakkı, daha basit görseller.' :
                            difficulty === 'medium' ? '1 ipucu hakkı, standart zorluk.' :
                                'İpucu yok! Sadece en iyiler için.'}
                    </div>
                </div>

                {/* Sound Setting */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>Ses Efektleri</span>
                    </label>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginLeft: '2.2rem', marginTop: '0.25rem' }}>
                        Oyun içi sesleri açıp kapatın.
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        background: message.includes('hata') ? '#fee2e2' : '#dcfce7',
                        color: message.includes('hata') ? '#991b1b' : '#166534',
                        borderRadius: '0.5rem',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <button
                    className="button"
                    onClick={handleSave}
                    disabled={saving || !token}
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <button className="button secondary-button" onClick={onBack} style={{ marginTop: '1rem' }}>
                Geri Dön
            </button>
        </div>
    );
}
