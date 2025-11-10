import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModeSelectScreen } from '../components/ModeSelectScreen';
import { api } from '../services/api';

vi.mock('../services/api');

describe('ModeSelectScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(api.listGameModes).mockImplementation(() => new Promise(() => {}));
    
    render(<ModeSelectScreen onSelectMode={vi.fn()} onBack={vi.fn()} />);
    
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
  });

  it('renders game modes after loading', async () => {
    vi.mocked(api.listGameModes).mockResolvedValue([
      { id: 1, name: 'classic', display_name: 'Klasik Mod', description: 'Classic mode', is_active: true, created_at: '2024-01-01' },
      { id: 2, name: 'timed', display_name: 'Zamana Karşı', description: 'Timed mode', is_active: true, created_at: '2024-01-01' },
    ]);
    
    render(<ModeSelectScreen onSelectMode={vi.fn()} onBack={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Klasik Mod')).toBeInTheDocument();
      expect(screen.getByText('Zamana Karşı')).toBeInTheDocument();
    });
  });

  it('calls onSelectMode when mode is clicked', async () => {
    const handleSelect = vi.fn();
    vi.mocked(api.listGameModes).mockResolvedValue([
      { id: 1, name: 'classic', display_name: 'Klasik Mod', description: 'Classic', is_active: true, created_at: '2024-01-01' },
    ]);
    
    render(<ModeSelectScreen onSelectMode={handleSelect} onBack={vi.fn()} />);
    
    await waitFor(() => screen.getByText('Klasik Mod'));
    
    fireEvent.click(screen.getByText('Klasik Mod'));
    expect(handleSelect).toHaveBeenCalledWith('classic');
  });

  it('calls onBack when back button clicked', async () => {
    const handleBack = vi.fn();
    vi.mocked(api.listGameModes).mockResolvedValue([]);
    
    render(<ModeSelectScreen onSelectMode={vi.fn()} onBack={handleBack} />);
    
    await waitFor(() => screen.getByRole('button', { name: /geri dön/i }));
    
    fireEvent.click(screen.getByRole('button', { name: /geri dön/i }));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});

