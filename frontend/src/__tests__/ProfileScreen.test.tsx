import { render, screen, waitFor } from '@testing-library/react';
import { ProfileScreen } from '../components/ProfileScreen';
import { AuthProvider } from '../context/AuthContext';
import { api } from '../services/api';

vi.mock('../services/api');

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  display_name: 'Test User',
  total_games: 10,
  games_won: 7,
  games_lost: 3,
  total_score: 15,
  best_time: 25.5,
  created_at: '2024-01-01',
  last_login: '2024-01-02',
};

const mockStats = {
  total_games: 10,
  games_won: 7,
  games_lost: 3,
  win_rate: 70.0,
  total_score: 15,
  best_time: 25.5,
  average_score: 1.5,
};

function renderWithAuth(component: React.ReactElement) {
  // Mock localStorage
  Storage.prototype.getItem = vi.fn((key) => {
    if (key === 'token') return 'fake-token';
    if (key === 'user') return JSON.stringify(mockUser);
    return null;
  });

  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
}

describe('ProfileScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(api.getUserStats).mockImplementation(() => new Promise(() => {}));
    
    renderWithAuth(<ProfileScreen onBack={vi.fn()} />);
    
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
  });

  it('renders user profile and stats', async () => {
    vi.mocked(api.getUserStats).mockResolvedValue(mockStats);
    
    renderWithAuth(<ProfileScreen onBack={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // total games
      expect(screen.getByText('70.0%')).toBeInTheDocument(); // win rate
    });
  });
});

