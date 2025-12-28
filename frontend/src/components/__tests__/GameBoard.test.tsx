import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { vi } from 'vitest';

describe('GameBoard', () => {
    const mockImages = [
        { id: 1, url: 'img1.jpg' },
        { id: 2, url: 'img2.jpg' },
    ];

    it('renders correctly', () => {
        render(
            <GameBoard
                images={mockImages}
                onSelect={() => { }}
                hint={null}
                selectedIndex={null}
            />
        );
        expect(screen.getByText('Hangi Görsel AI Tarafından Üretildi?')).toBeInTheDocument();
        expect(screen.getByAltText('Görsel 1')).toBeInTheDocument();
        expect(screen.getByAltText('Görsel 2')).toBeInTheDocument();
    });

    it('calls onSelect when a button is clicked', () => {
        const handleSelect = vi.fn();
        render(
            <GameBoard
                images={mockImages}
                onSelect={handleSelect}
                hint={null}
                selectedIndex={null}
            />
        );

        const buttons = screen.getAllByRole('button', { name: /Bu Görseli Seç/i });
        fireEvent.click(buttons[0]);
        expect(handleSelect).toHaveBeenCalledWith(0);
    });

    it('displays hint when provided', () => {
        render(
            <GameBoard
                images={mockImages}
                onSelect={() => { }}
                hint="This is a hint"
                selectedIndex={null}
            />
        );
        expect(screen.getByText(/This is a hint/i)).toBeInTheDocument();
    });

    it('shows second chance message on second attempt', () => {
        render(
            <GameBoard
                images={mockImages}
                onSelect={() => { }}
                hint={null}
                attemptNumber={1}
                selectedIndex={null}
            />
        );
        expect(screen.getByText('İkinci Şansınız!')).toBeInTheDocument();
    });

    it('disables buttons when loading', () => {
        render(
            <GameBoard
                images={mockImages}
                onSelect={() => { }}
                hint={null}
                isLoading={true}
                selectedIndex={null}
            />
        );
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
        expect(screen.getAllByText('Değerlendiriliyor...')[0]).toBeInTheDocument();
    });
});
