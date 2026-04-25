import type { TimeOption, WordOption } from '@/types';

// ---- Storage keys ----
export const STORAGE_KEYS = {
  USERNAME:      'typeforge_username',
  PERSONAL_BEST: 'typeforge_pb',
  STREAK_COUNT:  'typeforge_streak',
  STREAK_DATE:   'typeforge_streak_date',
  LEADERBOARD:   'typeforge_leaderboard',
  HISTORY:       'typeforge_history',
  THEME:         'typeforge_theme',
  LAST_MODE:     'typeforge_mode',
} as const;

// ---- Mode options ----
export const TIME_OPTIONS: TimeOption[] = [15, 30, 60];
export const WORD_OPTIONS: WordOption[] = [10, 25, 50];

// ---- Defaults ----
export const DEFAULT_TIME_OPTION: TimeOption = 30;
export const DEFAULT_WORD_OPTION: WordOption = 25;

// ---- Word buffer sizes ----
export const TIME_MODE_WORD_BUFFER = 200;
export const MAX_EXTRA_CHARS = 8;
export const MAX_WORD_LENGTH = 12;

// ---- Leaderboard ----
export const MAX_LEADERBOARD_ENTRIES = 10;

// ---- History ----
export const MAX_HISTORY_ENTRIES = 20;

// ---- Timing ----
export const WPM_UPDATE_INTERVAL_MS = 500;
export const TIMER_TICK_MS = 100;

// ---- Caret ----
export const CARET_BLINK_MS = 530;

// ---- Streak milestones ----
export const STREAK_GOLD_THRESHOLD  = 7;
export const STREAK_SHINE_THRESHOLD = 30;
