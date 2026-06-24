// Frontend API service layer - communicates with the backend server

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('nms_token');
}

function setToken(token: string): void {
  localStorage.setItem('nms_token', token);
}

function clearToken(): void {
  localStorage.removeItem('nms_token');
  localStorage.removeItem('nms_user');
}

function getStoredUser(): any {
  const raw = localStorage.getItem('nms_user');
  return raw ? JSON.parse(raw) : null;
}

function setStoredUser(user: any): void {
  localStorage.setItem('nms_user', JSON.stringify(user));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token) {
    // Only clear token on 401 if we had a token (not during login/register)
    clearToken();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data as T;
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  lives: number;
  totalScore: number;
  levelsPlayed: number;
  stars: number;
  totalTime: number;
  levelProgress: Record<string, { stars?: number; unlocked: boolean; timeUsed?: number }>;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function register(name: string, username: string, email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, username, email, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me');
}

export function logout(): void {
  clearToken();
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getCurrentUser(): AuthUser | null {
  return getStoredUser();
}

// ─── LEVELS ─────────────────────────────────────────────────────────────────

export interface LevelData {
  id: string;
  title: string;
  description: string;
  levelType: 'dasar' | 'tantangan' | 'custom';
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  category?: string;
  concept?: string;
  htmlStructure: string;
  timeLimit: number;
  isLocked: boolean;
  isUserCreated: boolean;
  createdBy?: string;
  propertyConfigs: { name: string; initialValue: string; targetValue: string }[];
}

export async function getLevels(): Promise<LevelData[]> {
  return request<LevelData[]>('/levels');
}

export async function createLevel(level: {
  id: string;
  title: string;
  description?: string;
  levelType?: string;
  difficulty?: string;
  category?: string;
  concept?: string;
  htmlStructure: string;
  timeLimit?: number;
  propertyConfigs: { name: string; initialValue: string; targetValue: string }[];
}): Promise<{ id: string; title: string }> {
  return request('/levels', {
    method: 'POST',
    body: JSON.stringify(level),
  });
}

export async function deleteLevel(id: string): Promise<void> {
  await request(`/levels/${id}`, { method: 'DELETE' });
}

// ─── PROGRESS ───────────────────────────────────────────────────────────────

export async function getProgress(username: string): Promise<Record<string, any>> {
  return request(`/progress/${username}`);
}

export async function updateProgress(username: string, data: {
  levelId: string;
  stars?: number;
  timeUsed?: number;
  score?: number;
  hintsUsed?: number;
  unlockNextLevelId?: string;
}): Promise<void> {
  await request(`/progress/${username}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateLives(username: string, lives: number): Promise<void> {
  await request(`/progress/${username}/lives`, {
    method: 'PUT',
    body: JSON.stringify({ lives }),
  });
}

// ─── LEADERBOARD ────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  totalScore: number;
  levelsPlayed: number;
  stars: number;
  totalTime: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return request<LeaderboardEntry[]>('/leaderboard');
}

// ─── PLAYERS (Developer only) ──────────────────────────────────────────────

export interface PlayerData {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  lives: number;
  totalScore: number;
  levelsPlayed: number;
  stars: number;
  totalTime: number;
  createdAt: string;
  progress?: any[];
}

export async function getPlayers(): Promise<PlayerData[]> {
  return request<PlayerData[]>('/players');
}

export async function getPlayerDetail(username: string): Promise<PlayerData> {
  return request<PlayerData>(`/players/${username}`);
}

export async function deletePlayer(username: string): Promise<void> {
  await request(`/players/${username}`, { method: 'DELETE' });
}

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string; db: string }> {
  return request('/health');
}
