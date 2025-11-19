import { render, screen, waitFor } from '@testing-library/react';
import { LeaderboardScreen } from '../components/LeaderboardScreen';
import { api } from '../services/api';

vi.mock('../services/api');

describe('LeaderboardScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(api.getTopByMode).mockImplementation(() => new Promise(() => {}));
    
    render(<LeaderboardScreen onBack={vi.fn()} gameMode="timed" />);
    
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
  });

  it('renders leaderboard entries', async () => {
    vi.mocked(api.getTopByMode).mockResolvedValue([
      {
        id: 1,
        player_name: 'Player1',
        score: 10,
        time_taken: 45.5,
        game_mode: 'timed',
        category: null,
        created_at: '2024-01-01',
        rank: 1,
      },
      {
        id: 2,
        player_name: 'Player2',
        score: 8,
        time_taken: 50.0,
        game_mode: 'timed',
        category: null,
        created_at: '2024-01-01',
        rank: 2,
      },
    ]);
    
    render(<LeaderboardScreen onBack={vi.fn()} gameMode="timed" />);
    
    await waitFor(() => {
      expect(screen.getByText('Player1')).toBeInTheDocument();
      expect(screen.getByText('Player2')).toBeInTheDocument();
      expect(screen.getByText('10 puan')).toBeInTheDocument();
    });
  });

  it('shows rank badges', async () => {
    vi.mocked(api.getTopByMode).mockResolvedValue([
      {
        id: 1,
        player_name: 'First',
        score: 10,
        time_taken: 45.5,
        game_mode: 'timed',
        category: null,
        created_at: '2024-01-01',
        rank: 1,
      },
    ]);
    
    render(<LeaderboardScreen onBack={vi.fn()} gameMode="timed" />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('First')).toBeInTheDocument();
    });
  });
});

