"use client";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number | null;
  wordsTyped: number;
  mode: "time" | "words";
  isActive: boolean;
}

function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <span
        style={{
          fontSize: "20px", // Reduced from 28px for subtlety
          fontWeight: 400,  // Thinner weight
          fontFamily: "'Roboto Mono', monospace", // Matched to the typing text
          color: "var(--text-muted)", // Subdued color so it doesn't fight for attention
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          transition: "color 200ms ease",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "11px", // Reduced from 12px
          fontWeight: 500,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: "var(--border)", // Blends deeply into the background
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function StatsBar({
  wpm,
  accuracy,
  errors,
  timeLeft,
  wordsTyped,
  mode,
  isActive,
}: StatsBarProps) {
  return (
    <div
      className="stats-gap"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px", // Tightened the gap slightly
        // Fades in ONLY when actively typing. Stays invisible when idle.
        opacity: isActive ? 1 : 0,
        transition: "opacity 400ms ease",
        pointerEvents: "none",
        height: "40px", // Reserve height so the layout doesn't jump when it appears
      }}
    >
      <Stat value={wpm} label="wpm" />
      <Stat value={`${accuracy}%`} label="acc" />
      <Stat value={errors} label="err" />
      {mode === "time" && timeLeft !== null && (
        <Stat value={`${timeLeft}s`} label="time" />
      )}
      {mode === "words" && (
        <Stat value={wordsTyped} label="words" />
      )}
    </div>
  );
}