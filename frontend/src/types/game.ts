export type GameStage = 'start' | 'play' | 'result';

export interface GameState {
  stage: GameStage;
  roundId: number | null;
  images: Array<{ id: number; url: string }>;
  selectedIndex: number | null;
  attemptNumber: number;
  hint: string | null;
  isCorrect: boolean | null;
  aiImageIndex: number | null;
  category: string | null;
  difficulty: string;
  isLoading: boolean;
  error: string | null;
}

export const initialGameState: GameState = {
  stage: 'start',
  roundId: null,
  images: [],
  selectedIndex: null,
  attemptNumber: 0,
  hint: null,
  isCorrect: null,
  aiImageIndex: null,
  category: null,
  difficulty: 'medium',
  isLoading: false,
  error: null,
};

