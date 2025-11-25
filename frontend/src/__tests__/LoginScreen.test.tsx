import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from '../components/LoginScreen';

describe('LoginScreen', () => {
  it('renders login form', () => {
    render(
      <LoginScreen
        onLogin={vi.fn()}
        onSwitchToRegister={vi.fn()}
        onBack={vi.fn()}
      />
    );
    
    expect(screen.getByText(/giriş yap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kullanıcı adı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
  });

  it('calls onLogin with credentials', async () => {
    const handleLogin = vi.fn().mockResolvedValue(undefined);
    
    render(
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToRegister={vi.fn()}
        onBack={vi.fn()}
      />
    );
    
    fireEvent.change(screen.getByLabelText(/kullanıcı adı/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/şifre/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));
    
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('testuser', 'pass123');
    });
  });

  it('switches to register', () => {
    const handleSwitch = vi.fn();
    
    render(
      <LoginScreen
        onLogin={vi.fn()}
        onSwitchToRegister={handleSwitch}
        onBack={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText(/kayıt ol/i));
    expect(handleSwitch).toHaveBeenCalledTimes(1);
  });
});

