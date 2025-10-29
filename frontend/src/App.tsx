import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [stage, setStage] = useState<'start' | 'play' | 'result'>('start');
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);

  function handleStart() {
    setStage('play');
  }

  function handleGuess(_index: number) {
    // Placeholder: always go to result
    setResult({ correct: false, message: 'İskelet: Sonuç ekranı örneği' });
    setStage('result');
  }

  function handleNewRound() {
    setStage('start');
    setResult(null);
  }

  if (stage === 'start') return <StartScreen onStart={handleStart} />;
  if (stage === 'play') return <GameBoard images={["/placeholder1.jpg","/placeholder2.jpg","/placeholder3.jpg"]} onSelect={handleGuess} hint={null} />;
  return <ResultScreen correct={!!result?.correct} message={result?.message ?? ''} onPlayAgain={handleNewRound} />;
}
