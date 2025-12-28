import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Timer } from '../Timer';

describe('Timer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders initial time limit', () => {
        render(<Timer timeLimit={60} onTimeUp={() => { }} />);
        expect(screen.getByText('60s')).toBeInTheDocument();
    });

    it('counts down', () => {
        render(<Timer timeLimit={10} onTimeUp={() => { }} />);

        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(screen.getByText('9s')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(screen.getByText('7s')).toBeInTheDocument();
    });

    it('calls onTimeUp when time reaches 0', () => {
        const handleTimeUp = vi.fn();
        render(<Timer timeLimit={3} onTimeUp={handleTimeUp} />);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(handleTimeUp).toHaveBeenCalled();
    });

    it('does not countdown when paused', () => {
        render(<Timer timeLimit={10} onTimeUp={() => { }} isPaused={true} />);

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getByText('10s')).toBeInTheDocument();
    });
});
