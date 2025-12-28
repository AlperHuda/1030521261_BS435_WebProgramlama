import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuScreen } from '../MenuScreen';

describe('MenuScreen', () => {
    it('renders the title correctly', () => {
        render(<MenuScreen onStartGame={() => { }} onViewStats={() => { }} />);
        expect(screen.getByText('AI Görsel Tahmin Oyunu')).toBeInTheDocument();
    });

    it('shows welcome message when username is provided', () => {
        render(
            <MenuScreen
                onStartGame={() => { }}
                onViewStats={() => { }}
                isAuthenticated={true}
                username="TestUser"
            />
        );
        expect(screen.getByText('Hoş geldin, TestUser!')).toBeInTheDocument();
    });

    it('calls onStartGame when start button is clicked', () => {
        const handleStart = vi.fn();
        render(<MenuScreen onStartGame={handleStart} onViewStats={() => { }} />);

        fireEvent.click(screen.getByText('Oyuna Başla'));
        expect(handleStart).toHaveBeenCalledTimes(1);
    });

    it('calls onViewStats when stats button is clicked', () => {
        const handleStats = vi.fn();
        render(<MenuScreen onStartGame={() => { }} onViewStats={handleStats} />);

        fireEvent.click(screen.getByText('İstatistikler'));
        expect(handleStats).toHaveBeenCalledTimes(1);
    });

    it('shows authentication buttons when not logged in', () => {
        const handleLogin = vi.fn();
        render(
            <MenuScreen
                onStartGame={() => { }}
                onViewStats={() => { }}
                onLogin={handleLogin}
                isAuthenticated={false}
            />
        );

        const loginBtn = screen.getByText('Giriş Yap / Kayıt Ol');
        expect(loginBtn).toBeInTheDocument();
        fireEvent.click(loginBtn);
        expect(handleLogin).toHaveBeenCalled();
    });

    it('shows profile, achievements, settings and multiplayer buttons when logged in', () => {
        const handleProfile = vi.fn();
        const handleAchievements = vi.fn();
        const handleSettings = vi.fn();
        const handleMultiplayer = vi.fn();

        render(
            <MenuScreen
                onStartGame={() => { }}
                onViewStats={() => { }}
                onProfile={handleProfile}
                onViewAchievements={handleAchievements}
                onSettings={handleSettings}
                onMultiplayer={handleMultiplayer}
                isAuthenticated={true}
                username="User"
            />
        );

        fireEvent.click(screen.getByText('Profilim'));
        expect(handleProfile).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Rozetlerim'));
        expect(handleAchievements).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Ayarlar'));
        expect(handleSettings).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Çok Oyunculu'));
        expect(handleMultiplayer).toHaveBeenCalled();
    });
});
