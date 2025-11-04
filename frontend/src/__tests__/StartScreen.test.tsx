import { render, screen, fireEvent } from '@testing-library/react';
import { StartScreen } from '../components/StartScreen';

describe('StartScreen', () => {
  it('renders title and rules', () => {
    const handleStart = vi.fn();
    render(<StartScreen onStart={handleStart} />);
    
    expect(screen.getByText(/AI Görsel Tahmin Oyunu/i)).toBeInTheDocument();
    expect(screen.getByText(/İlk tahmininizde yanlış yaparsanız/i)).toBeInTheDocument();
  });

  it('calls onStart when button is clicked', () => {
    const handleStart = vi.fn();
    render(<StartScreen onStart={handleStart} />);
    
    const button = screen.getByRole('button', { name: /başla/i });
    fireEvent.click(button);
    
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const handleStart = vi.fn();
    render(<StartScreen onStart={handleStart} isLoading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Yükleniyor...');
  });

  it('button is enabled by default', () => {
    const handleStart = vi.fn();
    render(<StartScreen onStart={handleStart} />);
    
    const button = screen.getByRole('button', { name: /başla/i });
    expect(button).not.toBeDisabled();
  });
});
