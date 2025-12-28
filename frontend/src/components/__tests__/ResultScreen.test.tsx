import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultScreen } from '../ResultScreen';

describe('ResultScreen', () => {
    it('renders success message when correct', () => {
        render(
            <ResultScreen
                correct={true}
                message="Başarılı Sonuç!"
                onPlayAgain={() => { }}
                onBackToMenu={() => { }}
                attemptNumber={1}
                aiImageIndex={0}
            />
        );
        expect(screen.getByText('Tebrikler!')).toBeInTheDocument(); // Title
        expect(screen.getByText('Başarılı Sonuç!')).toBeInTheDocument(); // Message
    });

    it('renders failure message when incorrect', () => {
        render(
            <ResultScreen
                correct={false}
                message="Başarısız Deneme."
                onPlayAgain={() => { }}
                onBackToMenu={() => { }}
                attemptNumber={2}
                aiImageIndex={0}
            />
        );
        expect(screen.getByText('Tekrar Deneyin')).toBeInTheDocument(); // Title
        expect(screen.getByText('Başarısız Deneme.')).toBeInTheDocument();
        expect(screen.getByText(/Görsel #1/)).toBeInTheDocument();
    });

    it('calls onPlayAgain when button is clicked', () => {
        const handlePlayAgain = vi.fn();
        render(
            <ResultScreen
                correct={true}
                message="Test"
                onPlayAgain={handlePlayAgain}
                onBackToMenu={() => { }}
                attemptNumber={1}
                aiImageIndex={0}
            />
        );
        fireEvent.click(screen.getByText('Yeni Tur'));
        expect(handlePlayAgain).toHaveBeenCalled();
    });

    it('calls onBackToMenu when button is clicked', () => {
        const handleMenu = vi.fn();
        render(
            <ResultScreen
                correct={true}
                message="Test"
                onPlayAgain={() => { }}
                onBackToMenu={handleMenu}
                attemptNumber={1}
                aiImageIndex={0}
            />
        );
        fireEvent.click(screen.getByText('Ana Menü'));
        expect(handleMenu).toHaveBeenCalled();
    });

    it('shows time taken when provided', () => {
        render(
            <ResultScreen
                correct={true}
                message="Test"
                onPlayAgain={() => { }}
                onBackToMenu={() => { }}
                attemptNumber={1}
                aiImageIndex={0}
                timeTaken={42}
            />
        );
        // "Süre: 42.0 saniye"
        expect(screen.getByText((content) => content.includes('42.0 saniye'))).toBeInTheDocument();
    });
});
