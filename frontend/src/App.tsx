import { useGame } from './hooks/useGame';
import { StartScreen } from './components/StartScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { ErrorDisplay } from './components/ErrorDisplay';

export default function App() {
  const { state, startGame, submitGuess, resetGame, startNewRound } = useGame();

  if (state.error) {
    return <ErrorDisplay message={state.error} onRetry={resetGame} />;
  }

  if (state.stage === 'start') {
    return <StartScreen onStart={() => startGame()} isLoading={state.isLoading} />;
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
      onBackToMenu={resetGame}
      aiImageIndex={state.aiImageIndex}
      attemptNumber={state.attemptNumber}
    />
  );
}
