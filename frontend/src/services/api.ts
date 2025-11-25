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
  game_mode?: string;
  time_limit?: number | null;
  start_time?: string | null;
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
  game_mode?: 'classic' | 'timed';
  time_limit?: number;
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

  // Leaderboard
  async createLeaderboardEntry(entry: {
    player_name: string;
    score: number;
    time_taken: number;
    game_mode: string;
    category?: string | null;
    round_id?: number | null;
  }): Promise<LeaderboardEntry> {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return handleResponse<LeaderboardEntry>(response);
  },

  async getLeaderboard(params?: {
    game_mode?: string;
    category?: string;
    limit?: number;
  }): Promise<LeaderboardEntry[]> {
    const searchParams = new URLSearchParams();
    if (params?.game_mode) searchParams.set('game_mode', params.game_mode);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/leaderboard?${searchParams}`);
    return handleResponse<LeaderboardEntry[]>(response);
  },

  async getTopByMode(gameMode: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard/top/${gameMode}?limit=${limit}`);
    return handleResponse<LeaderboardEntry[]>(response);
  },

  // Authentication
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse<User>(response);
  },

  async getUserStats(token: string): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/auth/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse<UserStats>(response);
  },

  async updateUserStats(token: string, won: boolean, score: number, timeTaken?: number): Promise<void> {
    const params = new URLSearchParams();
    params.set('won', won.toString());
    params.set('score', score.toString());
    if (timeTaken !== undefined) params.set('time_taken', timeTaken.toString());

    const response = await fetch(`${API_BASE_URL}/auth/stats/update?${params}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    await handleResponse<void>(response);
  },
};

export interface LeaderboardEntry {
  id: number;
  player_name: string;
  score: number;
  time_taken: number;
  game_mode: string;
  category: string | null;
  created_at: string;
  rank?: number;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  display_name: string | null;
  total_games: number;
  games_won: number;
  games_lost: number;
  total_score: number;
  best_time: number | null;
  created_at: string;
  last_login: string | null;
}

export interface UserStats {
  total_games: number;
  games_won: number;
  games_lost: number;
  win_rate: number;
  total_score: number;
  best_time: number | null;
  average_score: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  display_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
