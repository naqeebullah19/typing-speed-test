/**
 * Pure calculation functions — no side effects, fully testable.
 */

/**
 * Gross WPM — total characters typed / 5 / minutes elapsed.
 * Industry-standard "word" = 5 characters.
 */
export function calculateGrossWPM(
  totalCharsTyped: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0 || totalCharsTyped <= 0) return 0;
  return Math.round((totalCharsTyped / 5) / (elapsedSeconds / 60));
}

/**
 * Net WPM — subtracts uncorrected errors from gross WPM.
 * Each error counts as -1 per minute elapsed.
 */
export function calculateNetWPM(
  totalCharsTyped: number,
  errors: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0) return 0;
  const gross = calculateGrossWPM(totalCharsTyped, elapsedSeconds);
  const errorPenalty = errors / (elapsedSeconds / 60);
  return Math.max(0, Math.round(gross - errorPenalty));
}

/**
 * Accuracy — percentage of correct keystrokes out of total.
 */
export function calculateAccuracy(
  totalCharsTyped: number,
  errors: number,
): number {
  if (totalCharsTyped === 0) return 100;
  const raw = ((totalCharsTyped - errors) / totalCharsTyped) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

/**
 * Generate a mode key string for per-mode PB storage.
 * e.g. "time-30" or "words-25"
 */
export function getModeKey(mode: string, option: number): string {
  return `${mode}-${option}`;
}

/**
 * Format seconds to "Xs" or "Xm Ys" display string.
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}
