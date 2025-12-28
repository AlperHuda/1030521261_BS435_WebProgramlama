import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProfileScreen } from '../ProfileScreen';
import { vi } from 'vitest';
import * as AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';

// Mock the API and AuthContext
vi.mock('../../services/api');
vi.mock('../../context/AuthContext');

describe('ProfileScreen', () => {
    const mockUser = {
        username: 'testuser',
        display_name: 'Test User',
        email: 'test@example.com',
    };

    const mockStats = {
        total_games: 10,
        games_won: 6,
        games_lost: 4,
        win_rate: 60,
        total_score: 500,
        average_score: 50,
        best_time: 12.5,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (AuthContext.useAuth as any).mockReturnValue({
            user: mockUser,
            token: 'fake-token',
            logout: vi.fn(),
        });
    });

    it('renders loading state initially', () => {
        // Mock API to not resolve immediately
        (api.getUserStats as any).mockReturnValue(new Promise(() => { }));

        render(<ProfileScreen onBack={() => { }} />);
        expect(screen.getByText('Profil yükleniyor...')).toBeInTheDocument();
    });

    it('renders user stats after loading', async () => {
        (api.getUserStats as any).mockResolvedValue(mockStats);

        render(<ProfileScreen onBack={() => { }} />);

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('@testuser')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument(); // Total games
            expect(screen.getByText('60.0%')).toBeInTheDocument(); // Win rate
            expect(screen.getByText('12.5s')).toBeInTheDocument(); // Best time
        });
    });

    it('handlers API error', async () => {
        (api.getUserStats as any).mockRejectedValue(new Error('API Error'));

        render(<ProfileScreen onBack={() => { }} />);

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeInTheDocument();
        });
    });

    it('calls logout when logout button clicked', async () => {
        (api.getUserStats as any).mockResolvedValue(mockStats);
        const mockLogout = vi.fn();
        (AuthContext.useAuth as any).mockReturnValue({
            user: mockUser,
            token: 'fake-token',
            logout: mockLogout,
        });

        render(<ProfileScreen onBack={() => { }} />);

        await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Çıkış Yap'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('calls onBack', async () => {
        (api.getUserStats as any).mockResolvedValue(mockStats);
        const handleBack = vi.fn();

        render(<ProfileScreen onBack={handleBack} />);
        await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Geri Dön'));
        expect(handleBack).toHaveBeenCalled();
    });
});
