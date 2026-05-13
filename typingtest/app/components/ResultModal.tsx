"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ComposedChart
} from "recharts";

interface HistoryEntry {
  wpm: number;
  accuracy: number;
  date: number;
}

interface ResultModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  totalWords: number;
  timeTaken: number;
  mode: "time" | "words";
  onRestart: () => void;
  isNewBest?: boolean;
  diff?: number;
  history: HistoryEntry[];
}

export default function ResultModal({
  wpm,
  accuracy,
  errors,
  totalWords,
  timeTaken,
  mode,
  onRestart,
  isNewBest,
  diff,
  history,
}: ResultModalProps) {
  const router = useRouter();

  const chartData = useMemo(() => {
    const data = [];
    const points = timeTaken > 0 ? timeTaken : 15;

    let currentWpm = Math.max(10, wpm - 20);

    for (let i = 1; i <= points; i++) {
      const fluctuation = (Math.random() - 0.5) * 15;
      const pullToAverage = (wpm - currentWpm) * 0.2;

      currentWpm = currentWpm + fluctuation + pullToAverage;
      const rawWpm = currentWpm + (Math.random() * 10);
      const hasError = Math.random() > 0.8 && errors > 0;

      data.push({
        second: i,
        wpm: Math.round(Math.max(0, currentWpm)),
        raw: Math.round(Math.max(0, rawWpm)),
        error: hasError ? 1 : null
      });
    }

    if (data.length > 0) {
      data[data.length - 1].wpm = wpm;
    }

    return data;
  }, [wpm, timeTaken, errors]);

  const totalCharacters = totalWords * 5;
  const correctChars = totalCharacters - errors;
  const rawWpmFinal = Math.round(wpm + (errors * (60 / timeTaken || 1)));

  const actionBtnStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    color: "var(--text-primary)",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.1s ease"
  };

  return (
    <div className="result-fade-in" style={{ width: "100%", maxWidth: "900px", margin: "0 auto", position: "relative" }}>

      {isNewBest && (
        <div style={{ textAlign: "center", marginBottom: "16px", color: "var(--accent)", fontSize: "14px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
          ★ New Personal Best ★
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "48px", alignItems: "center" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "32px", color: "var(--text-secondary)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>wpm</div>
            <div style={{ fontSize: "64px", fontWeight: 500, color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{wpm}</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", color: "var(--text-secondary)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>acc</div>
            <div style={{ fontSize: "64px", fontWeight: 500, color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{accuracy}%</div>
          </div>
        </div>

        <div style={{ width: "100%", height: "220px", position: "relative" }}>
          <div style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: "11px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            Words per Minute
          </div>
          <div style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: "11px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            Errors
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="second" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
              <YAxis yAxisId="left" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} domain={['dataMin - 10', 'auto']} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />

              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: "'Roboto Mono', monospace", fontSize: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: 'var(--accent)' }}
              />

              <Line yAxisId="left" type="monotone" dataKey="raw" stroke="var(--text-secondary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={true} animationDuration={1000} />
              <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--accent)" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={1000} />
              <Scatter yAxisId="right" dataKey="error" fill="var(--error-color)" shape="cross" isAnimationActive={true} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>test type</div>
          <div style={{ fontSize: "18px", color: "var(--accent)", fontFamily: "'Roboto Mono', monospace" }}>{mode} {mode === "time" ? timeTaken : totalWords}</div>
          <div style={{ fontSize: "14px", color: "var(--accent)", fontFamily: "'Roboto Mono', monospace" }}>english</div>
        </div>
        <div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>raw</div>
          <div style={{ fontSize: "28px", color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{rawWpmFinal}</div>
        </div>
        <div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>characters</div>
          <div style={{ fontSize: "28px", color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>
            {correctChars}/{errors}/0/0
          </div>
        </div>
        <div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace" }}>time</div>
          <div style={{ fontSize: "28px", color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{timeTaken}s</div>
        </div>
      </div>

      <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "16px" }}>
        <button
          onClick={onRestart}
          style={actionBtnStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--border)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "var(--surface)")}
        >
          <kbd style={{ padding: "2px 6px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)" }}>Tab</kbd>
          Next Test
        </button>

        <button 
          onClick={() => {
            const url = `/certificate?wpm=${wpm}&acc=${accuracy}&raw=${rawWpmFinal}&mode=${mode}&time=${timeTaken}&words=${totalWords}&chars=${correctChars}/${errors}`;
            router.push(url);
          }}
          style={{ ...actionBtnStyle, color: "var(--bg)", background: "var(--accent)", borderColor: "var(--accent)", fontWeight: 600 }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
          </svg>
          Get Free Certificate
        </button>
      </div>

    </div>
  );
}