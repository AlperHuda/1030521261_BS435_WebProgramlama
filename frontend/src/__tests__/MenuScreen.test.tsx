import { render, screen, fireEvent } from '@testing-library/react';
import { MenuScreen } from '../components/MenuScreen';

describe('MenuScreen', () => {
  it('renders main menu with buttons', () => {
    const handleStart = vi.fn();
    const handleStats = vi.fn();
    
    render(<MenuScreen onStartGame={handleStart} onViewStats={handleStats} />);
    
    expect(screen.getByText(/AI Görsel Tahmin Oyunu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /oyuna başla/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /istatistikler/i })).toBeInTheDocument();
  });

  it('calls onStartGame when start button clicked', () => {
    const handleStart = vi.fn();
    const handleStats = vi.fn();
    
    render(<MenuScreen onStartGame={handleStart} onViewStats={handleStats} />);
    
    fireEvent.click(screen.getByRole('button', { name: /oyuna başla/i }));
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('calls onViewStats when stats button clicked', () => {
    const handleStart = vi.fn();
    const handleStats = vi.fn();
    
    render(<MenuScreen onStartGame={handleStart} onViewStats={handleStats} />);
    
    fireEvent.click(screen.getByRole('button', { name: /istatistikler/i }));
    expect(handleStats).toHaveBeenCalledTimes(1);
  });
});

