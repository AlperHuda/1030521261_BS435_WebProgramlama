import { useState } from 'react';
import { api } from '../services/api';
import { GameState, initialGameState } from '../types/game';

export function useGame() {
  const [state, setState] = useState<GameState>(initialGameState);

  function goToMenu() {
    setState(initialGameState);
  }

  function goToModeSelect() {
    setState({ ...initialGameState, stage: 'mode-select' });
  }

  function selectMode(modeName: string) {
    setState(prev => ({ ...prev, gameMode: modeName, stage: 'category-select' }));
  }

  async function selectCategoryAndStart(category: string | null, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    setState(prev => ({ ...prev, isLoading: true, error: null, category }));
    
    try {
      const response = await api.createRound({ category, difficulty });
      setState(prev => ({
        ...prev,
        stage: 'play',
        roundId: response.round_id,
        images: response.images,
        category: response.category,
        difficulty: response.difficulty,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start game',
        stage: 'menu',
      }));
    }
  }

  async function submitGuess(selectedIndex: number) {
    if (!state.roundId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedIndex }));
    
    try {
      const response = await api.submitGuess(state.roundId, selectedIndex);
      
      if (response.game_over) {
        // Game is over, go to result screen
        setState(prev => ({
          ...prev,
          stage: 'result',
          isCorrect: response.is_correct,
          attemptNumber: response.attempt_number,
          aiImageIndex: response.ai_image_index,
          hint: response.hint,
          isLoading: false,
        }));
      } else {
        // First attempt was wrong, show hint and allow second attempt
        setState(prev => ({
          ...prev,
          attemptNumber: response.attempt_number,
          hint: response.hint,
          isCorrect: false,
          selectedIndex: null,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to submit guess',
      }));
    }
  }

  function resetGame() {
    setState(initialGameState);
  }

  function startNewRound() {
    selectCategoryAndStart(state.category, state.difficulty as 'easy' | 'medium' | 'hard');
  }

  function goToStats() {
    setState(prev => ({ ...prev, stage: 'menu' })); // Stats handled separately in App
  }

  return {
    state,
    goToMenu,
    goToModeSelect,
    selectMode,
    selectCategoryAndStart,
    submitGuess,
    resetGame,
    startNewRound,
    goToStats,
  };
}
