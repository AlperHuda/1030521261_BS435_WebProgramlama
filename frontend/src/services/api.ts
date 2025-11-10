const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ImagePublic {
  id: number;
  url: string;
}

export interface RoundResponse {
  round_id: number;
  images: ImagePublic[];
  category: string | null;
  difficulty: string;
}

export interface GuessResponse {
  round_id: number;
  is_correct: boolean;
  attempt_number: number;
  hint: string | null;
  game_over: boolean;
  ai_image_index: number | null;
}

export interface StatsResponse {
  total_rounds: number;
  total_guesses: number;
  correct_first_attempt: number;
  correct_second_attempt: number;
  failed: number;
  accuracy: number;
}

export interface RoundCreateRequest {
  category?: string | null;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GuessRequest {
  selected_index: number;
}

export interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface GameMode {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CategoryStats {
  category: string;
  total_images: number;
  ai_images: number;
  real_images: number;
  total_rounds_played: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, errorData.detail || 'Request failed');
  }
  return response.json();
}

export const api = {
  async createRound(request: RoundCreateRequest = {}): Promise<RoundResponse> {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<RoundResponse>(response);
  },

  async submitGuess(roundId: number, selectedIndex: number): Promise<GuessResponse> {
    const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_index: selectedIndex }),
    });
    return handleResponse<GuessResponse>(response);
  },

  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return handleResponse<StatsResponse>(response);
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string }>(response);
  },

  async listCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse<Category[]>(response);
  },

  async getCategoryStats(categoryName: string): Promise<CategoryStats> {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryName}/stats`);
    return handleResponse<CategoryStats>(response);
  },

  async listGameModes(): Promise<GameMode[]> {
    const response = await fetch(`${API_BASE_URL}/categories/modes`);
    return handleResponse<GameMode[]>(response);
  },
};
