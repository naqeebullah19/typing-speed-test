"use client";

import { useEffect } from "react";
import PerformanceGraph from "./PerformanceGraph";

interface ResultModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  totalWords: number;
  timeTaken: number;
  mode: "time" | "words";
  onRestart: () => void;
  isNewBest?: boolean;
  diff?: number; // Difference from previous best
  history?: { wpm: number; accuracy: number; date: number }[];
}

function Stat({ value, label, isWpm = false }: { value: string | number; label: string; isWpm?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: isWpm ? "40px" : "24px",
          fontWeight: isWpm ? 600 : 500,
          color: "var(--text-primary)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ResultModal({
  wpm,
  accuracy,
  errors,
  timeTaken,
  onRestart,
  isNewBest,
  diff = 0,
  history = [],
}: ResultModalProps) {

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Tab") { e.preventDefault(); onRestart(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRestart]);

  return (
    <div style={{ animation: "fadeInResult 200ms ease both", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* THE DOPAMINE BLOCK */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        {isNewBest ? (
          <div style={{ color: "var(--pb-color)", fontWeight: 600, fontSize: "16px", fontFamily: "'Inter', sans-serif" }}>
            🔥 NEW BEST — {wpm} WPM
            <span style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 400, marginTop: "4px" }}>
              +{diff} from last best
            </span>
          </div>
        ) : (
          <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "16px", fontFamily: "'Inter', sans-serif" }}>
            {wpm} WPM
            <span style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", fontWeight: 400, marginTop: "4px" }}>
              {diff > 0 ? `+${diff}` : diff} from best
            </span>
          </div>
        )}
      </div>

      {/* STATS (Tighter grouping, aligned with Typing UI) */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "32px", marginBottom: "32px" }}>
        <Stat value={wpm} label="wpm" isWpm />
        <Stat value={`${accuracy}%`} label="acc" />
        <Stat value={errors} label="err" />
        <Stat value={`${timeTaken}s`} label="time" />
      </div>

      {/* SUBTLE GRAPH */}
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "24px" }}>
        <PerformanceGraph history={history} />
      </div>

      {/* SEAMLESS ACTION */}
      <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
        Press <kbd style={{ padding: "2px 6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)" }}>Tab</kbd> to retry
      </span>
    </div>
  );
}