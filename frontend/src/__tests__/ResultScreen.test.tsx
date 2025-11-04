import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from '../components/ResultScreen';

describe('ResultScreen', () => {
  it('shows success message for correct answer', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={true}
        message="Tebrikler!"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={1}
        attemptNumber={1}
      />
    );
    
    expect(screen.getByText('Tebrikler!')).toBeInTheDocument();
    expect(screen.getByText(/Görsel #2/i)).toBeInTheDocument();
  });

  it('shows failure message for incorrect answer', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={false}
        message="Tekrar deneyin"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={0}
        attemptNumber={2}
      />
    );
    
    expect(screen.getByText('Tekrar Deneyin')).toBeInTheDocument();
  });

  it('calls onPlayAgain when new round button clicked', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={true}
        message="Win"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={1}
        attemptNumber={1}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /yeni tur/i }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onBackToMenu when menu button clicked', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={false}
        message="Loss"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={2}
        attemptNumber={2}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /ana menü/i }));
    expect(onBackToMenu).toHaveBeenCalledTimes(1);
  });

  it('shows first attempt success badge', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={true}
        message="Perfect"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={0}
        attemptNumber={1}
      />
    );
    
    expect(screen.getByText(/İlk denemede doğru/i)).toBeInTheDocument();
  });

  it('shows second attempt success message', () => {
    const onPlayAgain = vi.fn();
    const onBackToMenu = vi.fn();
    
    render(
      <ResultScreen
        correct={true}
        message="Good"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
        aiImageIndex={2}
        attemptNumber={2}
      />
    );
    
    expect(screen.getByText(/İkinci denemede başardınız/i)).toBeInTheDocument();
  });
});
