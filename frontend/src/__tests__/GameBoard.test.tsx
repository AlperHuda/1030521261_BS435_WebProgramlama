import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../components/GameBoard';

describe('GameBoard', () => {
  const mockImages = [
    { id: 1, url: '/a.jpg' },
    { id: 2, url: '/b.jpg' },
    { id: 3, url: '/c.jpg' },
  ];

  it('renders three images', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint={null}
        selectedIndex={null}
      />
    );
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('calls onSelect with correct index', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint={null}
        selectedIndex={null}
      />
    );
    
    const buttons = screen.getAllByRole('button', { name: /bu görseli seç/i });
    fireEvent.click(buttons[1]);
    
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('displays hint when provided', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint="Yüz simetrisine bakın"
        selectedIndex={null}
      />
    );
    
    expect(screen.getByText(/Yüz simetrisine bakın/i)).toBeInTheDocument();
    expect(screen.getByText(/İpucu:/i)).toBeInTheDocument();
  });

  it('shows second chance message', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint="Hint"
        attemptNumber={1}
        selectedIndex={0}
      />
    );
    
    expect(screen.getByText(/İkinci Şansınız!/i)).toBeInTheDocument();
  });

  it('disables previously selected button on second attempt', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint="Hint"
        attemptNumber={1}
        selectedIndex={0}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('shows loading state', () => {
    const onSelect = vi.fn();
    render(
      <GameBoard
        images={mockImages}
        onSelect={onSelect}
        hint={null}
        isLoading={true}
        selectedIndex={null}
      />
    );
    
    expect(screen.getByText(/Değerlendiriliyor.../i)).toBeInTheDocument();
  });
});
