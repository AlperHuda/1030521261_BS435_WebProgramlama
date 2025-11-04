import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from '../components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay message="Network error" onRetry={onRetry} />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText(/Hata/i)).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay message="Error" onRetry={onRetry} />);
    
    fireEvent.click(screen.getByRole('button', { name: /tekrar dene/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

