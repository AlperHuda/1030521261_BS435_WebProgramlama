import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from '../LoginScreen';
import { vi } from 'vitest';

describe('LoginScreen', () => {
    it('renders login form', () => {
        render(
            <LoginScreen
                onLogin={async () => { }}
                onSwitchToRegister={() => { }}
                onBack={() => { }}
            />
        );
        expect(screen.getByRole('heading', { name: /Giriş Yap/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Kullanıcı Adı/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Şifre/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(
            <LoginScreen
                onLogin={async () => { }}
                onSwitchToRegister={() => { }}
                onBack={() => { }}
            />
        );

        const userInput = screen.getByLabelText(/Kullanıcı Adı/i);
        const passInput = screen.getByLabelText(/Şifre/i);

        fireEvent.change(userInput, { target: { value: 'testuser' } });
        fireEvent.change(passInput, { target: { value: 'password123' } });

        expect(userInput).toHaveValue('testuser');
        expect(passInput).toHaveValue('password123');
    });

    it('calls onLogin with correct credentials', async () => {
        const handleLogin = vi.fn().mockResolvedValue(undefined);
        render(
            <LoginScreen
                onLogin={handleLogin}
                onSwitchToRegister={() => { }}
                onBack={() => { }}
            />
        );

        fireEvent.change(screen.getByLabelText(/Kullanıcı Adı/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Şifre/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

        await waitFor(() => {
            expect(handleLogin).toHaveBeenCalledWith('testuser', 'password123');
        });
    });

    it('displays error message on failure', async () => {
        const handleLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
        render(
            <LoginScreen
                onLogin={handleLogin}
                onSwitchToRegister={() => { }}
                onBack={() => { }}
            />
        );

        fireEvent.change(screen.getByLabelText(/Kullanıcı Adı/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Şifre/i), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('calls onSwitchToRegister and onBack', () => {
        const handleSwitch = vi.fn();
        const handleBack = vi.fn();
        render(
            <LoginScreen
                onLogin={async () => { }}
                onSwitchToRegister={handleSwitch}
                onBack={handleBack}
            />
        );

        fireEvent.click(screen.getByText('Kayıt Ol'));
        expect(handleSwitch).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Ana Menüye Dön'));
        expect(handleBack).toHaveBeenCalled();
    });
});
