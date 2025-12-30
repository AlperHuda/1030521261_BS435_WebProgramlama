
import { useState, useEffect, lazy, Suspense } from 'react';
import { useGame } from './hooks/useGame';
import { useAuth } from './context/AuthContext';
import { MenuScreen } from './components/MenuScreen';
import { ModeSelectScreen } from './components/ModeSelectScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { soundService } from './services/sound';
import { api } from './services/api';

// Lazy loaded components
const StatsScreen = lazy(() => import('./components/StatsScreen').then(module => ({ default: module.StatsScreen })));
const LeaderboardScreen = lazy(() => import('./components/LeaderboardScreen').then(module => ({ default: module.LeaderboardScreen })));
const LoginScreen = lazy(() => import('./components/LoginScreen').then(module => ({ default: module.LoginScreen })));
const RegisterScreen = lazy(() => import('./components/RegisterScreen').then(module => ({ default: module.RegisterScreen })));
const ProfileScreen = lazy(() => import('./components/ProfileScreen').then(module => ({ default: module.ProfileScreen })));
const SettingsScreen = lazy(() => import('./components/SettingsScreen').then(module => ({ default: module.SettingsScreen })));
const AchievementList = lazy(() => import('./components/AchievementList').then(module => ({ default: module.AchievementList })));
const LobbyScreen = lazy(() => import('./components/LobbyScreen').then(module => ({ default: module.LobbyScreen })));
const MultiplayerGameScreen = lazy(() => import('./components/MultiplayerGameScreen').then(module => ({ default: module.MultiplayerGameScreen })));

import { ErrorDisplay } from './components/ErrorDisplay';
import { Timer } from './components/Timer';
import { PlayerNameModal } from './components/PlayerNameModal';
import { AchievementNotification } from './components/AchievementNotification';
import ErrorBoundary from './components/common/ErrorBoundary';
import Skeleton from './components/common/Skeleton';

const LoadingScreen = () => (
  <div className="container center" style={{ flexDirection: 'column', gap: '20px' }}>
    <Skeleton width="100%" height={60} />
    <Skeleton width="100%" height={400} />
  </div>
);

export default function App() {
  const { state, goToMenu, goToModeSelect, selectMode, selectCategoryAndStart, submitGuess, resetGame, startNewRound, handleTimeUp } = useGame();
  const { user, token, login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [activeMultiplayerLobby, setActiveMultiplayerLobby] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Sync sound settings
  useEffect(() => {
    if (user) {
      soundService.setEnabled(user.is_sound_enabled ?? true);
    }
  }, [user]);

  // Update user stats after game ends
  useEffect(() => {
    if (state.stage === 'result' && isAuthenticated && token && state.isCorrect !== null) {
      // Play sound
      if (state.isCorrect) soundService.playCorrect();
      else soundService.playWrong();

      // Update stats and check for new achievements
      api.updateUserStats(
        token,
        state.isCorrect,
        state.isCorrect ? 1 : 0,
        state.timeTaken || undefined
      ).then((earned) => {
        if (earned && earned.length > 0) {
          setNewAchievements(earned);
          soundService.playCorrect(); // Double ding for achievement?
        }
      }).catch(err => console.error('Failed to update stats:', err));
    }
  }, [state.stage, state.isCorrect, isAuthenticated, token, state.timeTaken]);

  // Use user's preferred difficulty if available when starting game
  const handleSelectCategory = async (category: string | null) => {
    // category can be null for "Random"
    const difficulty = (user?.preferred_difficulty || 'medium') as 'easy' | 'medium' | 'hard';
    selectCategoryAndStart(category, difficulty);
  };

  async function handleSaveScore(playerName: string) {
    // Save score for any mode that supports scoring/leaderboard
    if (state.score > 0 || state.gameMode === 'timed' || state.gameMode === 'time_attack') {
      try {
        await api.createLeaderboardEntry({
          player_name: playerName,
          score: state.score,
          time_taken: state.timeTaken || 0,
          game_mode: state.gameMode || 'classic',
          category: state.category,
          round_id: state.roundId,
        });
      } catch (err) {
        console.error('Failed to save score:', err);
      }
    }
    setShowNameModal(false);
    setShowLeaderboard(true);
  }

  function handleResultAction(action: 'play-again' | 'menu' | 'leaderboard') {
    if (action === 'leaderboard') {
      const hasLeaderboard = ['timed', 'time_attack', 'marathon'].includes(state.gameMode || '');
      if (hasLeaderboard) {
        setShowNameModal(true);
      } else {
        goToMenu();
      }
    } else if (action === 'play-again') {
      startNewRound();
    } else {
      goToMenu();
    }
  }

  if (state.error) {
    return <ErrorDisplay message={state.error} onRetry={resetGame} />;
  }

  if (authLoading) {
    return (
      <div className="center">
        <LoadingScreen />
      </div>
    );
  }

  if (showStats) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <StatsScreen onBack={() => setShowStats(false)} />
      </Suspense>
    );
  }

  if (showSettings) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <SettingsScreen onBack={() => setShowSettings(false)} />
      </Suspense>
    );
  }

  if (showLeaderboard) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LeaderboardScreen onBack={() => { setShowLeaderboard(false); goToMenu(); }} gameMode={state.gameMode || 'timed'} />
      </Suspense>
    );
  }

  if (showAchievements) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AchievementList onBack={() => setShowAchievements(false)} />
      </Suspense>
    );
  }

  if (showLogin) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginScreen
          onLogin={async (username, password) => {
            await login(username, password);
            setShowLogin(false);
          }}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onBack={() => setShowLogin(false)}
        />
      </Suspense>
    );
  }

  if (showRegister) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <RegisterScreen
          onRegister={async (username, password, email, displayName) => {
            await register(username, password, email, displayName);
            setShowRegister(false);
          }}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onBack={() => setShowRegister(false)}
        />
      </Suspense>
    );
  }

  if (showProfile) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ProfileScreen onBack={() => setShowProfile(false)} />
      </Suspense>
    );
  }

  if (activeMultiplayerLobby) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <MultiplayerGameScreen
          lobbyId={activeMultiplayerLobby}
          onBack={() => { setActiveMultiplayerLobby(null); goToMenu(); }}
        />
      </Suspense>
    );
  }

  if (showLobby) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LobbyScreen
          onBack={() => setShowLobby(false)}
          onGameStart={(lobbyId) => {
            console.log("Starting multiplayer game in lobby:", lobbyId);
            setShowLobby(false);
            setActiveMultiplayerLobby(lobbyId);
          }}
        />
      </Suspense>
    );
  }

  if (state.stage === 'menu') {
    return (
      <MenuScreen
        onStartGame={goToModeSelect}
        onViewStats={() => setShowStats(true)}

        // Gated actions: Show always, but check auth on click
        onViewAchievements={() => isAuthenticated ? setShowAchievements(true) : setShowLogin(true)}
        onSettings={() => isAuthenticated ? setShowSettings(true) : setShowLogin(true)}
        onLogin={() => setShowLogin(true)}
        onProfile={() => isAuthenticated ? setShowProfile(true) : setShowLogin(true)}
        onMultiplayer={() => isAuthenticated ? setShowLobby(true) : setShowLogin(true)}

        isAuthenticated={isAuthenticated}
        username={user?.display_name || user?.username}
      />
    );
  }

  if (state.stage === 'mode-select') {
    return (
      <ModeSelectScreen
        onSelectMode={selectMode}
        onBack={goToMenu}
      />
    );
  }

  if (state.stage === 'category-select') {
    return (
      <CategorySelectScreen
        onSelectCategory={handleSelectCategory}
        onBack={goToModeSelect}
        isLoading={state.isLoading}
      />
    );
  }

  if (state.stage === 'play') {
    return (
      <div>
        {state.timeLimit && state.timeLimit > 0 && (
          <div className="container" style={{ paddingBottom: 0 }}>
            <Timer
              timeLimit={state.timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={state.isLoading}
            />
          </div>
        )}
        <GameBoard
          images={state.images}
          onSelect={(index) => {
            soundService.playClick();
            submitGuess(index);
          }}
          hint={state.hint}
          isLoading={state.isLoading}
          attemptNumber={state.attemptNumber}
          selectedIndex={state.selectedIndex}
        />
      </div>
    );
  }

  return (
    <>
      <AchievementNotification
        achievements={newAchievements}
        onClose={() => setNewAchievements([])}
      />
      <ResultScreen
        correct={state.isCorrect ?? false}
        message={
          state.isCorrect
            ? state.attemptNumber === 1
              ? 'Mükemmel! İlk denemede doğru buldunuz!'
              : 'Tebrikler! İkinci denemede doğru buldunuz!'
            : (state.timeLimit && state.timeTaken === state.timeLimit)
              ? 'Süre doldu! Maalesef doğru tahmin yapamadınız.'
              : 'Maalesef doğru tahmin yapamadınız.'
        }
        onPlayAgain={() => handleResultAction('play-again')}
        onBackToMenu={() => handleResultAction('menu')}
        onViewLeaderboard={['timed', 'time_attack', 'marathon'].includes(state.gameMode || '') ? () => handleResultAction('leaderboard') : undefined}
        aiImageIndex={state.aiImageIndex}
        attemptNumber={state.attemptNumber}
        timeTaken={state.timeTaken}
        gameMode={state.gameMode}
      />
      {showNameModal && (
        <PlayerNameModal
          onSubmit={handleSaveScore}
          onSkip={() => { setShowNameModal(false); setShowLeaderboard(true); }}
        />
      )}
    </>
  );
}
