"use client";

import { useEffect, useState, useRef } from "react";

type Theme = "light" | "dark";

interface HeaderProps {
  mode: "time" | "words";
  timeOption: number;
  wordOption: number;
  onModeChange: (mode: "time" | "words") => void;
  onTimeOptionChange: (t: number) => void;
  onWordOptionChange: (w: number) => void;
  disabled?: boolean;
  streak?: number;
  onLeaderboardClick: () => void;
}

const BTN_BASE: React.CSSProperties = {
  height: "28px",
  padding: "0 10px",
  fontSize: "13px",
  fontWeight: 400, // Reduced weight for a cleaner monospace look
  fontFamily: "'Roboto Mono', monospace", // Swapped to match the typing text!
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  transition: "background 150ms ease, color 150ms ease",
  letterSpacing: "0",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const OPTIONS = [15, 30, 60, 120];

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
  const [isCustom, setIsCustom] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = saved ?? (prefersDark ? "dark" : "light");
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  useEffect(() => {
    if (isCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustom]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customVal, 10);
    if (!isNaN(num) && num > 0) {
      if (mode === "time") onTimeOptionChange(num);
      else onWordOptionChange(num);
    }
    setIsCustom(false);
    setCustomVal("");
  };

  const activeStyle: React.CSSProperties = {
    ...BTN_BASE,
    background: "transparent",
    color: "var(--accent)", // Colors the text gold or green
  };

  const inactiveStyle: React.CSSProperties = {
    ...BTN_BASE,
    background: "transparent",
    color: "var(--text-secondary)",
    opacity: disabled ? 0.45 : 1,
  };

  const activeValue = mode === "time" ? timeOption : wordOption;

  // Bulletproof Pill Background
  const pillBackground = "var(--surface, var(--bg-secondary, rgba(150, 150, 150, 0.12)))";

  return (
    <header
      style={{
        height: "64px",
        borderBottom: "1px solid transparent",
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Dynamic SVG Lightning Bolt - Matches the accent color automatically! */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="var(--accent)"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, opacity: 0.9 }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>

            <span
              style={{
                fontSize: "24px",
                fontWeight: 500,
                letterSpacing: "-1px",
                color: "var(--text-primary)",
                fontFamily: "'Roboto Mono', monospace", // Swapped to Monospace
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              typing speed test
            </span>
          </div>

          {streak > 0 && (
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--streak-color)", fontFamily: "'Inter', sans-serif", opacity: 0.9 }}>
              🔥 {streak} {streak === 1 ? "day" : "days"}
            </span>
          )}
        </div>

        {/* Center Controls (The Pills) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

          {/* Pill 1: Mode Select (Time / Words) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: pillBackground,
            padding: "4px",
            borderRadius: "8px",
            transition: "opacity 0.2s ease"
          }}>
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

          {/* Pill 2: Values (15, 30, 60, 120, Wrench) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            minWidth: "180px",
            justifyContent: "center",
            background: pillBackground,
            padding: "4px",
            borderRadius: "8px",
            transition: "opacity 0.2s ease"
          }}>
            {isCustom ? (
              <form onSubmit={handleCustomSubmit} style={{ display: "flex", alignItems: "center", margin: 0, width: "100%" }}>
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  onBlur={() => setIsCustom(false)}
                  placeholder="custom..."
                  style={{
                    ...BTN_BASE,
                    background: "transparent",
                    color: "var(--text-primary)",
                    width: "100%",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </form>
            ) : (
              <>
                {OPTIONS.map((val) => {
                  const isActive = activeValue === val;
                  return (
                    <button
                      key={val}
                      onClick={() => !disabled && (mode === "time" ? onTimeOptionChange(val) : onWordOptionChange(val))}
                      style={isActive ? activeStyle : { ...inactiveStyle, cursor: disabled ? "not-allowed" : "pointer" }}
                      onMouseEnter={(e) => { if (!disabled && !isActive) e.currentTarget.style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { if (!disabled && !isActive) e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      {val}
                    </button>
                  );
                })}

                <button
                  onClick={() => !disabled && setIsCustom(true)}
                  style={!OPTIONS.includes(activeValue) ? activeStyle : { ...inactiveStyle, cursor: disabled ? "not-allowed" : "pointer", padding: "0 8px" }}
                  onMouseEnter={(e) => { if (!disabled && OPTIONS.includes(activeValue)) e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { if (!disabled && OPTIONS.includes(activeValue)) e.currentTarget.style.color = "var(--text-secondary)"; }}
                  aria-label="Custom settings"
                  title="Custom settings"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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