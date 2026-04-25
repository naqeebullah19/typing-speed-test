// ============================================================
// ALL SHARED TYPESCRIPT TYPES FOR TYPEFORGE
// ============================================================

// --- App State Machine ---
export type AppStatus = 'idle' | 'active' | 'finished';

// --- Mode System ---
export type TestMode = 'time' | 'words';
export type TimeOption = 15 | 30 | 60;
export type WordOption = 10 | 25 | 50;

export interface ModeConfig {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
}

// --- Typing Engine ---
export type CharState = 'upcoming' | 'correct' | 'incorrect' | 'current';

export interface CharData {
  char: string;
  state: CharState;
}

export interface WordData {
  chars: CharData[];
  isComplete: boolean;
  hasError: boolean;
}

export interface CaretPosition {
  top: number;
  left: number;
}

// --- Metrics ---
export interface LiveMetrics {
  wpm: number;
  grossWpm: number;
  accuracy: number;
  errors: number;
  totalCharsTyped: number;
  elapsedSeconds: number;
}

// --- Personal Best ---
export interface PersonalBest {
  wpm: number;
  grossWpm: number;
  accuracy: number;
  date: string; // ISO string
  mode: string; // e.g. "time-30"
}

// --- Test Record (History) ---
export interface TestRecord {
  id: string;
  wpm: number;
  grossWpm: number;
  accuracy: number;
  errors: number;
  mode: string;
  duration: number; // elapsed seconds
  date: string; // ISO string
}

// --- Leaderboard ---
export interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
  mode: string;
  date: string; // ISO string
}

// --- Streak ---
export interface StreakData {
  count: number;
  lastDate: string | null; // date string from Date.toDateString()
}

// --- Result (post-test snapshot) ---
export interface TestResult {
  wpm: number;
  grossWpm: number;
  accuracy: number;
  errors: number;
  totalCharsTyped: number;
  duration: number;
  mode: string;
  isPersonalBest: boolean;
  previousBest: number | null;
}

// --- Theme ---
export type Theme = 'light' | 'dark';
