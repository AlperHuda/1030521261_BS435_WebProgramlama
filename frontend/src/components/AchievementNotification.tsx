import { useEffect, useState } from 'react';

interface AchievementNotificationProps {
    achievements: string[];
    onClose: () => void;
}

export function AchievementNotification({ achievements, onClose }: AchievementNotificationProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Auto close after some time (3s per achievement)
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500); // Wait for fade out
        }, achievements.length * 3000);

        return () => clearTimeout(timer);
    }, [achievements, onClose]);

    if (!achievements.length) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 0.5s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            {achievements.map((name, index) => (
                <div
                    key={index}
                    style={{
                        background: '#fff',
                        borderLeft: '5px solid #eab308',
                        padding: '1rem',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        minWidth: '250px',
                        animation: `slideIn 0.5s ease-out ${index * 0.2}s backwards`
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🏆</span>
                        <div>
                            <h4 style={{ margin: 0, color: '#eab308', fontSize: '0.8rem' }}>YENİ ROZET KAZANILDI!</h4>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{name}</p>
                        </div>
                    </div>
                </div>
            ))}
            <style>
                {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
            </style>
        </div>
    );
}
