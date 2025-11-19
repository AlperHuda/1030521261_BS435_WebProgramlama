import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { MenuScreen } from './components/MenuScreen';
import { ModeSelectScreen } from './components/ModeSelectScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { StatsScreen } from './components/StatsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Timer } from './components/Timer';
import { PlayerNameModal } from './components/PlayerNameModal';
import { api } from './services/api';

export default function App() {
  const { state, goToMenu, goToModeSelect, selectMode, selectCategoryAndStart, submitGuess, resetGame, startNewRound, handleTimeUp } = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

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

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />;
  }

  if (showLeaderboard) {
    return <LeaderboardScreen onBack={() => { setShowLeaderboard(false); goToMenu(); }} gameMode={state.gameMode || 'timed'} />;
  }

  if (state.stage === 'menu') {
    return (
      <MenuScreen
        onStartGame={goToModeSelect}
        onViewStats={() => setShowStats(true)}
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
