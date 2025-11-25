import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { useAuth } from './context/AuthContext';
import { MenuScreen } from './components/MenuScreen';
import { ModeSelectScreen } from './components/ModeSelectScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { StatsScreen } from './components/StatsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Timer } from './components/Timer';
import { PlayerNameModal } from './components/PlayerNameModal';
import { api } from './services/api';

export default function App() {
  const { state, goToMenu, goToModeSelect, selectMode, selectCategoryAndStart, submitGuess, resetGame, startNewRound, handleTimeUp } = useGame();
  const { user, token, login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Update user stats after game ends
  useEffect(() => {
    if (state.stage === 'result' && isAuthenticated && token && state.isCorrect !== null) {
      api.updateUserStats(
        token,
        state.isCorrect,
        state.isCorrect ? 1 : 0,
        state.timeTaken || undefined
      ).catch(err => console.error('Failed to update stats:', err));
    }
  }, [state.stage, state.isCorrect, isAuthenticated, token, state.timeTaken]);

  async function handleSaveScore(playerName: string) {
    if (state.gameMode === 'timed' && state.timeTaken !== null) {
      try {
        await api.createLeaderboardEntry({
          player_name: playerName,
          score: state.score,
          time_taken: state.timeTaken,
          game_mode: state.gameMode,
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
    if (action === 'leaderboard' && state.gameMode === 'timed') {
      setShowNameModal(true);
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
        <div className="container" style={{ textAlign: 'center' }}>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />;
  }

  if (showLeaderboard) {
    return <LeaderboardScreen onBack={() => { setShowLeaderboard(false); goToMenu(); }} gameMode={state.gameMode || 'timed'} />;
  }

  if (showLogin) {
    return (
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
    );
  }

  if (showRegister) {
    return (
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
    );
  }

  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />;
  }

  if (state.stage === 'menu') {
    return (
      <MenuScreen
        onStartGame={goToModeSelect}
        onViewStats={() => setShowStats(true)}
        onLogin={() => setShowLogin(true)}
        onProfile={() => setShowProfile(true)}
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
        onSelectCategory={(category) => selectCategoryAndStart(category, 'medium')}
        onBack={goToModeSelect}
      />
    );
  }

  if (state.stage === 'play') {
    return (
      <div>
        {state.gameMode === 'timed' && state.timeLimit && (
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
          onSelect={submitGuess}
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
      <ResultScreen
        correct={state.isCorrect ?? false}
        message={
          state.isCorrect
            ? state.attemptNumber === 1
              ? 'Mükemmel! İlk denemede doğru buldunuz!'
              : 'Tebrikler! İkinci denemede doğru buldunuz!'
            : state.gameMode === 'timed' && state.timeTaken === state.timeLimit
            ? 'Süre doldu! Maalesef doğru tahmin yapamadınız.'
            : 'Maalesef doğru tahmin yapamadınız.'
        }
        onPlayAgain={() => handleResultAction('play-again')}
        onBackToMenu={() => handleResultAction('menu')}
        onViewLeaderboard={state.gameMode === 'timed' ? () => handleResultAction('leaderboard') : undefined}
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
