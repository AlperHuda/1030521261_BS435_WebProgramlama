import { render, screen, waitFor } from '@testing-library/react';
import { Timer } from '../components/Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial time', () => {
    const onTimeUp = vi.fn();
    render(<Timer timeLimit={30} onTimeUp={onTimeUp} />);
    
    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(screen.getByText(/kalan süre/i)).toBeInTheDocument();
  });

  it('counts down', async () => {
    const onTimeUp = vi.fn();
    render(<Timer timeLimit={5} onTimeUp={onTimeUp} />);
    
    expect(screen.getByText('5s')).toBeInTheDocument();
    
    vi.advanceTimersByTime(1000);
    await waitFor(() => expect(screen.getByText('4s')).toBeInTheDocument());
    
    vi.advanceTimersByTime(1000);
    await waitFor(() => expect(screen.getByText('3s')).toBeInTheDocument());
  });

  it('calls onTimeUp when time reaches zero', async () => {
    const onTimeUp = vi.fn();
    render(<Timer timeLimit={2} onTimeUp={onTimeUp} />);
    
    vi.advanceTimersByTime(2000);
    
    await waitFor(() => expect(onTimeUp).toHaveBeenCalledTimes(1));
  });

  it('does not count when paused', async () => {
    const onTimeUp = vi.fn();
    const { rerender } = render(<Timer timeLimit={10} onTimeUp={onTimeUp} isPaused={true} />);
    
    expect(screen.getByText('10s')).toBeInTheDocument();
    
    vi.advanceTimersByTime(2000);
    
    // Should still be 10s because paused
    expect(screen.getByText('10s')).toBeInTheDocument();
    
    // Unpause
    rerender(<Timer timeLimit={10} onTimeUp={onTimeUp} isPaused={false} />);
    
    vi.advanceTimersByTime(1000);
    await waitFor(() => expect(screen.getByText('9s')).toBeInTheDocument());
  });
});

