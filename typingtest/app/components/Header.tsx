"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Theme = "light" | "dark";

interface HeaderProps {
  mode: "time" | "words";
  timeOption: 15 | 30 | 60;
  wordOption: 10 | 25 | 50;
  onModeChange: (mode: "time" | "words") => void;
  onTimeOptionChange: (t: 15 | 30 | 60) => void;
  onWordOptionChange: (w: 10 | 25 | 50) => void;
  disabled?: boolean;
  streak?: number;
  onLeaderboardClick: () => void;
}

const BTN_BASE: React.CSSProperties = {
  height: "32px",
  padding: "0 12px",
  fontSize: "13px",
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  transition: "background 150ms ease, color 150ms ease",
  letterSpacing: "0",
  whiteSpace: "nowrap",
};

export default function Header({
  mode,
  timeOption,
  wordOption,
  onModeChange,
  onTimeOptionChange,
  onWordOptionChange,
  disabled,
  streak = 0,
  onLeaderboardClick,
}: HeaderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = saved ?? (prefersDark ? "dark" : "light");
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const activeStyle: React.CSSProperties = {
    ...BTN_BASE,
    background: "var(--accent)",
    color: "var(--accent-inverse)",
  };

  const inactiveStyle: React.CSSProperties = {
    ...BTN_BASE,
    background: "transparent",
    color: "var(--text-secondary)",
    opacity: disabled ? 0.45 : 1,
  };

  return (
    <header
      style={{
        height: "64px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left Side: Logo & Inline Streak */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

          {/* Logo and Name Container */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image
              src="/logo.png" // The new filename to bust the cache!
              alt="Typing Speed Test Logo"
              width={100} // Wider to accommodate the speed lines
              height={40}
              priority // Tells Next.js to load this immediately
              style={{
                objectFit: "contain", // "contain" prevents the speed lines from being cropped
                flexShrink: 0,
                width: "auto", // Allows the width to adjust based on the height
                height: "40px",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "var(--text-primary)",
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              Typing Speed Test
            </span>
          </div>

          {streak > 0 && (
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--streak-color)", fontFamily: "'Inter', sans-serif", opacity: 0.9 }}>
              🔥 {streak} {streak === 1 ? "day" : "days"}
            </span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Mode group */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {(["time", "words"] as const).map((m) => (
              <button
                key={m}
                onClick={() => !disabled && onModeChange(m)}
                style={mode === m ? activeStyle : { ...inactiveStyle, cursor: disabled ? "not-allowed" : "pointer" }}
                onMouseEnter={(e) => { if (!disabled && mode !== m) e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { if (!disabled && mode !== m) e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />

          {/* Sub-options group */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {mode === "time"
              ? ([15, 30, 60] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => !disabled && onTimeOptionChange(t)}
                  style={timeOption === t ? activeStyle : { ...inactiveStyle, cursor: disabled ? "not-allowed" : "pointer" }}
                  onMouseEnter={(e) => { if (!disabled && timeOption !== t) e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { if (!disabled && timeOption !== t) e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {t}s
                </button>
              ))
              : ([10, 25, 50] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => !disabled && onWordOptionChange(w)}
                  style={wordOption === w ? activeStyle : { ...inactiveStyle, cursor: disabled ? "not-allowed" : "pointer" }}
                  onMouseEnter={(e) => { if (!disabled && wordOption !== w) e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { if (!disabled && wordOption !== w) e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {w}
                </button>
              ))}
          </div>

          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />

          {/* Leaderboard toggle */}
          <button
            onClick={onLeaderboardClick}
            aria-label="Open Leaderboard"
            title="Leaderboard"
            style={{ ...BTN_BASE, background: "transparent", color: "var(--text-secondary)", padding: "0 8px", fontSize: "15px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            🏆
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{ ...BTN_BASE, background: "transparent", color: "var(--text-secondary)", padding: "0 8px", fontSize: "15px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  );
}