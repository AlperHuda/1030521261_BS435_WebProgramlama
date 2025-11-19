export type GameStage = 'menu' | 'mode-select' | 'category-select' | 'play' | 'result';

export interface GameState {
  stage: GameStage;
  gameMode: string | null;
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
  timeLimit: number | null;
  startTime: Date | null;
  timeTaken: number | null;
  score: number;
}

export const initialGameState: GameState = {
  stage: 'menu',
  gameMode: null,
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
  timeLimit: null,
  startTime: null,
  timeTaken: null,
  score: 0,
};
