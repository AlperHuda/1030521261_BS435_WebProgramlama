import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { MenuScreen } from './components/MenuScreen';
import { ModeSelectScreen } from './components/ModeSelectScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { StatsScreen } from './components/StatsScreen';
import { ErrorDisplay } from './components/ErrorDisplay';

export default function App() {
  const { state, goToMenu, goToModeSelect, selectMode, selectCategoryAndStart, submitGuess, resetGame, startNewRound } = useGame();
  const [showStats, setShowStats] = useState(false);

  if (state.error) {
    return <ErrorDisplay message={state.error} onRetry={resetGame} />;
  }

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />;
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
      <GameBoard
        images={state.images}
        onSelect={submitGuess}
        hint={state.hint}
        isLoading={state.isLoading}
        attemptNumber={state.attemptNumber}
        selectedIndex={state.selectedIndex}
      />
    );
  }

  return (
    <ResultScreen
      correct={state.isCorrect ?? false}
      message={
        state.isCorrect
          ? state.attemptNumber === 1
            ? 'Mükemmel! İlk denemede doğru buldunuz!'
            : 'Tebrikler! İkinci denemede doğru buldunuz!'
          : 'Maalesef doğru tahmin yapamadınız.'
      }
      onPlayAgain={startNewRound}
      onBackToMenu={goToMenu}
      aiImageIndex={state.aiImageIndex}
      attemptNumber={state.attemptNumber}
    />
  );
}
