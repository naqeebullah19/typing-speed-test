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
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "28px",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-1px",
          color: "var(--text-primary)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          transition: "color 200ms ease",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
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
        gap: "48px",
        opacity: isActive ? 1 : 0.38,
        transition: "opacity 250ms ease",
        pointerEvents: "none",
      }}
    >
      <Stat value={isActive ? wpm : 0} label="wpm" />
      <Stat value={`${isActive ? accuracy : 100}%`} label="acc" />
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
