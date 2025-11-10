import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategorySelectScreen } from '../components/CategorySelectScreen';
import { api } from '../services/api';

vi.mock('../services/api');

describe('CategorySelectScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(api.listCategories).mockImplementation(() => new Promise(() => {}));
    
    render(<CategorySelectScreen onSelectCategory={vi.fn()} onBack={vi.fn()} />);
    
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
  });

  it('renders categories after loading', async () => {
    vi.mocked(api.listCategories).mockResolvedValue([
      { id: 1, name: 'portrait', display_name: 'Portre', description: 'Portraits', icon: null, created_at: '2024-01-01' },
      { id: 2, name: 'landscape', display_name: 'Manzara', description: 'Landscapes', icon: null, created_at: '2024-01-01' },
    ]);
    
    render(<CategorySelectScreen onSelectCategory={vi.fn()} onBack={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Portre')).toBeInTheDocument();
      expect(screen.getByText('Manzara')).toBeInTheDocument();
    });
  });

  it('renders random option', async () => {
    vi.mocked(api.listCategories).mockResolvedValue([]);
    
    render(<CategorySelectScreen onSelectCategory={vi.fn()} onBack={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Rastgele')).toBeInTheDocument();
    });
  });

  it('calls onSelectCategory with null for random', async () => {
    const handleSelect = vi.fn();
    vi.mocked(api.listCategories).mockResolvedValue([]);
    
    render(<CategorySelectScreen onSelectCategory={handleSelect} onBack={vi.fn()} />);
    
    await waitFor(() => screen.getByText('Rastgele'));
    
    fireEvent.click(screen.getByText('Rastgele'));
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('calls onSelectCategory with category name', async () => {
    const handleSelect = vi.fn();
    vi.mocked(api.listCategories).mockResolvedValue([
      { id: 1, name: 'portrait', display_name: 'Portre', description: 'Test', icon: null, created_at: '2024-01-01' },
    ]);
    
    render(<CategorySelectScreen onSelectCategory={handleSelect} onBack={vi.fn()} />);
    
    await waitFor(() => screen.getByText('Portre'));
    
    fireEvent.click(screen.getByText('Portre'));
    expect(handleSelect).toHaveBeenCalledWith('portrait');
  });
});

