"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; 
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TypingBox, { TypingBoxHandle } from "./components/TypingBox";
import ResultModal from "./components/ResultModal";
import LeaderboardModal from "./components/LeaderboardModal";
import { generateWords } from "../lib/words";
import { useStats } from "../hooks/useStats";

type Mode = "time" | "words";
type TimeOption = number; 
type WordOption = number; 
type AppState = "idle" | "active" | "finished";

const WORD_BUFFER = 800;

// --- 1. PERFORMANCE OPTIMIZED LIVE KEYBOARD ---
const LiveKeyboard = ({ isActive, resetTrigger }: { isActive: boolean, resetTrigger: number }) => {
  const [localKeyCounts, setLocalKeyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setLocalKeyCounts({});
  }, [resetTrigger]);

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
      const key = e.key === " " ? "SPACE" : e.key.toUpperCase();
      setLocalKeyCounts((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  const rows = [
    ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps Lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Alt", "Space", "Alt", "Ctrl"]
  ];

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ textAlign: "center", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>Live Keyboard Activity</div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {row.map((keyLabel, keyIndex) => {
            let flex = 1;
            let minWidth = "40px";
            if (keyLabel === "Backspace") { flex = 1.5; minWidth = "85px"; }
            if (keyLabel === "Tab") { flex = 1.2; minWidth = "60px"; }
            if (keyLabel === "Caps Lock") { flex = 1.5; minWidth = "85px"; }
            if (keyLabel === "Enter") { flex = 1.8; minWidth = "90px"; }
            if (keyLabel === "Shift") { flex = 2.2; minWidth = "100px"; }
            if (keyLabel === "Space") { flex = 6; minWidth = "260px"; }
            if (keyLabel === "Ctrl" || keyLabel === "Alt") { flex = 1.2; minWidth = "60px"; }
            const lookupCode = keyLabel === "Space" ? "SPACE" : keyLabel.toUpperCase();
            const hits = localKeyCounts[lookupCode] || 0;
            const isHit = hits > 0;
            return (
              <div key={keyIndex} style={{ flex, minWidth, height: "48px", background: isHit ? "var(--accent)" : "var(--bg)", border: `1px solid ${isHit ? "var(--accent)" : "var(--border)"}`, color: isHit ? "var(--bg)" : "var(--text-primary)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: isHit ? 700 : 500, transition: "all 0.15s ease" }}>
                {keyLabel}
                {isHit && <span style={{ position: "absolute", bottom: "3px", right: "5px", fontSize: "9px", fontWeight: 700, opacity: 0.8 }}>{hits}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// --- 2. COMPONENT: Error Heatmap Sidebar ---
const ErrorSidebar = ({ errorCounts, keyCounts }: { errorCounts: Record<string, number>, keyCounts: Record<string, number> }) => {
  const sortedErrors = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalPresses = Object.values(keyCounts).reduce((a, b) => a + b, 0);
  const uniqueKeys = Object.keys(keyCounts).length;
  return (
    <div className="result-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "16px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Error Heatmap</h3>
        {sortedErrors.length === 0 ? <div style={{ color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>No errors made! Perfect.</div> :
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {sortedErrors.map(([char, count], idx) => (
              <div key={char} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", fontFamily: "'Inter', sans-serif" }}>#{idx + 1}</span>
                  <span style={{ fontSize: "28px", color: "var(--accent)", fontWeight: 700, fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{char}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", fontFamily: "'Inter', sans-serif" }}>{count} misses</span>
              </div>
            ))}
          </div>
        }
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
         <h3 style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "20px", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Key Stats</h3>
         <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid var(--border)", marginBottom: "12px" }}>
             <span style={{ color: "var(--text-muted)", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>Total Presses</span>
             <span style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "'Roboto Mono', monospace", fontSize: "16px" }}>{totalPresses}</span>
         </div>
         <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>Unique Keys</span><span style={{ color: "var(--text-primary)", fontWeight: 600, fontFamily: "'Roboto Mono', monospace", fontSize: "16px" }}>{uniqueKeys}</span></div>
      </div>
    </div>
  )
}

// --- 3. COMPONENT: Local History Table ---
const TestHistoryTable = ({ history }: { history: any[] }) => {
  if (!history || history.length === 0) return null;
  const recentHistory = [...history].sort((a, b) => b.date - a.date).slice(0, 5);
  return (
    <div id="history-table" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "48px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}><h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}></span>Recent test history</h3></div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)", marginBottom: "12px", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}><div>Date</div><div>WPM</div><div>Accuracy</div></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {recentHistory.map((entry, i) => {
          const dateObj = new Date(entry.date);
          const formattedDate = `${dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", padding: "12px 0", fontSize: "14px", fontFamily: "'Inter', sans-serif", borderBottom: i === recentHistory.length - 1 ? "none" : "1px solid var(--bg)" }}><div style={{ color: "var(--text-secondary)" }}>{formattedDate}</div><div style={{ color: "var(--accent)", fontWeight: 600 }}>{entry.wpm}</div><div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{entry.accuracy}%</div></div>
          );
        })}
      </div>
    </div>
  );
};


// --- MAIN PAGE ---
export default function Home() {
  const router = useRouter(); 
  const [mode, setMode] = useState<Mode>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(30); 
  const [wordOption, setWordOption] = useState<WordOption>(30); 
  const [appState, setAppState] = useState<AppState>("idle");
  const [resetTrigger, setResetTrigger] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const keyCountsRef = useRef<Record<string, number>>({});
  const errorCountsRef = useRef<Record<string, number>>({});
  const [finalKeyCounts, setFinalKeyCounts] = useState<Record<string, number>>({});
  const [finalErrorCounts, setFinalErrorCounts] = useState<Record<string, number>>({});
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [result, setResult] = useState<{wpm: number, accuracy: number, errors: number, totalWords: number, timeTaken: number, isNewBest?: boolean, diff?: number} | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const typingBoxRef = useRef<TypingBoxHandle>(null);
  const resultRef = useRef<HTMLDivElement>(null); 
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const correctWordsRef = useRef(0);
  const totalWordsAttemptedRef = useRef(0);
  const errorsRef = useRef(0);
  const { streak, saveTestResult, history, leaderboard, userName, updateUserName } = useStats();

  useEffect(() => { const initialWords = generateWords(WORD_BUFFER); setWords(initialWords); }, []);
  useEffect(() => { setTimeLeft(timeOption); }, [timeOption]);
  useEffect(() => {
    if (appState !== "active") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
      const key = e.key === " " ? "SPACE" : e.key.toUpperCase();
      keyCountsRef.current[key] = (keyCountsRef.current[key] || 0) + 1;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appState]);

  const stopTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  const finish = useCallback(async () => {
    stopTimer();
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const timeTaken = mode === "time" ? timeOption : elapsed;
    const finalWpm = Math.round((correctWordsRef.current / timeTaken) * 60);
    const total = totalWordsAttemptedRef.current;
    const finalAcc = total === 0 ? 100 : Math.round(((total - errorsRef.current) / total) * 100);
    const calculatedWpm = Math.max(0, finalWpm);
    const calculatedAcc = Math.max(0, finalAcc);
    const statsResult = await saveTestResult(calculatedWpm, calculatedAcc);
    setFinalKeyCounts({ ...keyCountsRef.current });
    setFinalErrorCounts({ ...errorCountsRef.current });
    setResult({ wpm: calculatedWpm, accuracy: calculatedAcc, errors: errorsRef.current, totalWords: correctWordsRef.current, timeTaken, isNewBest: statsResult.isNewBest, diff: statsResult.diff });
    setAppState("finished");
  }, [mode, timeOption, stopTimer, saveTestResult]);

  const handleStart = useCallback(() => {
    setAppState("active");
    startTimeRef.current = Date.now();
    if (mode === "time") {
      let remaining = timeOption;
      timerRef.current = setInterval(() => {
        remaining -= 1; setTimeLeft(remaining);
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
        if (elapsed > 0) setWpm(Math.round(correctWordsRef.current / elapsed));
        if (remaining <= 0) finish();
      }, 1000);
    }
  }, [mode, timeOption, finish]);

  const handleWordComplete = useCallback((correct: boolean) => {
    totalWordsAttemptedRef.current += 1;
    if (correct) { correctWordsRef.current += 1; } else { errorsRef.current += 1; setErrors(errorsRef.current); }
    const completed = correctWordsRef.current;
    setWordsCompleted(completed);
    const total = totalWordsAttemptedRef.current;
    setAccuracy(total === 0 ? 100 : Math.round(((total - errorsRef.current) / total) * 100));
    if (startTimeRef.current > 0) { const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; if (elapsed > 0) setWpm(Math.round(completed / elapsed)); }
  }, []);

  const reset = useCallback(() => {
    stopTimer(); correctWordsRef.current = 0; totalWordsAttemptedRef.current = 0; errorsRef.current = 0; startTimeRef.current = 0;
    setAppState("idle"); setWpm(0); setAccuracy(100); setErrors(0); setWordsCompleted(0); setTimeLeft(timeOption); setResult(null);
    keyCountsRef.current = {}; errorCountsRef.current = {}; setFinalKeyCounts({}); setFinalErrorCounts({}); setResetTrigger(p => p + 1);
    const newWords = mode === "words" ? generateWords(wordOption + 30) : generateWords(WORD_BUFFER);
    setWords(newWords); typingBoxRef.current?.reset(newWords);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopTimer, mode, timeOption, wordOption]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Tab" && !isLeaderboardOpen) { e.preventDefault(); reset(); } };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [reset, isLeaderboardOpen]);

  const handleModeChange = useCallback((m: Mode) => { setMode(m); setTimeout(() => reset(), 0); }, [reset]);
  const handleTimeOptionChange = useCallback((t: TimeOption) => { setTimeOption(t); setTimeout(() => reset(), 0); }, [reset]);
  const handleWordOptionChange = useCallback((w: WordOption) => { setWordOption(w); setTimeout(() => reset(), 0); }, [reset]);

  const isActive = appState === "active";
  const isFinished = appState === "finished";
  const hasHistory = history && history.length > 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", transition: "background var(--transition-slow)" }}>
      <h1 style={{ display: "none" }}>Free Typing Speed Test — Measure Your WPM and Accuracy Online</h1>
      <div style={{ opacity: isActive ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: isActive ? "none" : "auto" }}>
        <Header mode={mode} timeOption={timeOption} wordOption={wordOption} onModeChange={handleModeChange} onTimeOptionChange={handleTimeOptionChange} onWordOptionChange={handleWordOptionChange} disabled={isActive} streak={streak} onLeaderboardClick={() => setIsLeaderboardOpen(true)} />
      </div>
      <main className="page-fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 0 80px" }}>
        <div className="container" style={{ width: "100%" }}>
          <StatsBar wpm={wpm} accuracy={accuracy} errors={errors} timeLeft={mode === "time" ? timeLeft : null} wordsTyped={wordsCompleted} mode={mode} isActive={isActive} />
          <div style={{ maxWidth: "760px", margin: "48px auto 0" }}>
            {words.length > 0 && <TypingBox ref={typingBoxRef} words={words} onStart={handleStart} onWordComplete={handleWordComplete} onFinish={finish} isFinished={isFinished} mode={mode} totalWords={mode === "words" ? wordOption : undefined} onRestart={reset} onErrorTracking={(char) => { errorCountsRef.current[char] = (errorCountsRef.current[char] || 0) + 1; }} />}
          </div>
          {isFinished && (
            <div className="result-in" style={{ maxWidth: "760px", width: "100%", margin: "24px auto 0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Time's up — Test finished</div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}><button onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>See results</button><button onClick={reset} style={{ background: "var(--accent)", border: "none", color: "var(--bg)", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontFamily: "'Inter', sans-serif", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}><kbd style={{ padding: "2px 6px", background: "var(--bg)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>Tab</kbd>Restart</button><span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>Results below ↓</span></div>
            </div>
          )}
          <div style={{ maxWidth: "800px", margin: "40px auto 0" }}><LiveKeyboard isActive={isActive} resetTrigger={resetTrigger} /></div>
          <div ref={resultRef} style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
            {isFinished && result && (
              <div className="result-in" style={{ paddingTop: "60px", marginTop: "60px", borderTop: "1px dashed var(--border)", width: "100%" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "flex-start" }}>
                  <div style={{ flex: "1 1 650px", minWidth: 0 }}><ResultModal wpm={result.wpm} accuracy={result.accuracy} errors={result.errors} totalWords={result.totalWords} timeTaken={result.timeTaken} mode={mode} onRestart={reset} isNewBest={result.isNewBest} diff={result.diff} history={history} /></div>
                  <div style={{ flex: "0 0 320px", width: "100%" }}><ErrorSidebar errorCounts={finalErrorCounts} keyCounts={finalKeyCounts} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <section style={{ marginTop: "100px", maxWidth: "1000px", width: "100%", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", textAlign: "left", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}><h2 style={{ color: "var(--text-primary)", fontSize: "32px", marginBottom: "12px", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>About typingspeedtest.live</h2><p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>A calm place to measure your typing speed, understand your habits, and feel your progress one key at a time.</p></div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px", marginBottom: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}><h3 style={{ color: "var(--text-primary)", fontSize: "22px", marginBottom: "20px", fontFamily: "'Inter', sans-serif" }}>What makes typingspeedtest.live different?</h3><p style={{ marginBottom: "16px", fontSize: "15px" }}>Light, friendly, and highly accurate. Everything runs locally in your browser for maximum privacy. Press start and type naturally your report shows <strong>net WPM from correct characters only</strong>, real accuracy, and a per-key error heat map that pinpoints your problem letters and symbols.</p><p style={{ marginBottom: "32px", fontSize: "15px" }}>No surprise paywalls or popups. Choose between 15s up to 120s time modes or exact word count modes. The layout adapts to your device and keeps your attention strictly on the next character not the UI.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: 500 }}><span style={{ color: "var(--accent)" }}>•</span> WPM from correct characters only</div><div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: 500 }}><span style={{ color: "var(--accent)" }}>•</span> Error heat map for letters and symbols</div><div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: 500 }}><span style={{ color: "var(--accent)" }}>•</span> Clean, distraction-free interface</div><div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: 500 }}><span style={{ color: "var(--accent)" }}>•</span> Privacy by default local processing</div></div></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            <div 
              onClick={() => {
                if (result || hasHistory) {
                  let stats;
                  if (result) {
                    const correctChars = (result.totalWords * 5) - result.errors;
                    const rawWpmFinal = Math.round(result.wpm + (result.errors * (60 / result.timeTaken || 1)));
                    stats = { wpm: result.wpm, acc: result.accuracy, raw: rawWpmFinal, mode, time: result.timeTaken, words: result.totalWords, chars: `${correctChars}/${result.errors}` };
                  } else {
                    const latest = [...history].sort((a, b) => b.date - a.date)[0];
                    stats = { wpm: latest.wpm, acc: latest.accuracy, raw: latest.wpm, mode: 'time', time: 30, words: 0, chars: `${latest.wpm * 5}/0` };
                  }
                  localStorage.setItem("last_test_stats", JSON.stringify(stats));
                  router.push("/certificate");
                } else { reset(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
              }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column" }} onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            ><h3 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>Get a beautifully designed free certificate</h3><p style={{ color: "var(--text-secondary)", marginBottom: "24px", flex: 1, fontSize: "15px" }}>Show your expertise with a polished certificate reflecting your <strong>100% accurate results</strong>. Print it, or download as PNG perfect for school, job apps, portfolios, and team bragging rights.</p><div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", color: "var(--text-secondary)", fontSize: "14px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download as PNG</div><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Print-ready high resolution layout</div><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> No account required - completely free</div></div><button style={{ background: "var(--accent)", color: "var(--bg)", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, fontFamily: "'Inter', sans-serif", width: "fit-content", cursor: "pointer", fontSize: "14px" }}>{hasHistory || result ? "Open my certificate →" : "Start Test to Get Certificate →"}</button></div>
            <div onClick={() => { if (hasHistory || result) { document.getElementById('history-table')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } else { reset(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column" }} onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}><h3 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "10px" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>Your Performance Analytics</h3><p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "15px" }}>See how your typing speed and accuracy improve over time with clear trend charts. <strong>Scores are stored securely in your browser</strong> your data stays on your device.</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}><div style={{ background: "var(--bg)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}><div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>WPM Progress Trend</div><div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Track speed gains per session.</div></div><div style={{ background: "var(--bg)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}><div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>Accuracy Trend</div><div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Stabilize form and reduce errors.</div></div></div><div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", color: "var(--text-secondary)", flex: 1, fontSize: "14px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Interactive Error Heatmap</div><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Private by default no uploads</div></div><button style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, fontFamily: "'Inter', sans-serif", width: "fit-content", cursor: "pointer", fontSize: "14px" }}>{hasHistory || result ? "View your history ↓" : "Take a Test to View Charts →"}</button></div>
          </div>
          <TestHistoryTable history={history} />
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>What Is a Typing Speed Test?</h2>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>A typing speed test measures your typing speed in words per minute (WPM). Whether you are applying for a data entry job, trying to type faster for school, or simply want to improve your daily workflow, taking a keyboard typing test provides a clear benchmark of your current skills.</p>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>When you use our free typing speed test, you receive instant feedback the moment the timer stops. There are no accounts to create this is a free wpm test no sign up required. We calculate your net WPM, the standard metric used by employers and educators. By factoring in uncorrected errors, a net WPM test gives you an honest look at your real-world typing proficiency rather than just raw speed.</p>
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>Why Take a Free WPM Test Online?</h2>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>In today’s digital workplace, keyboard fluency is an essential skill. A fast typing test helps you save time drafting emails, writing essays, or coding.</p>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Taking an online typing test no login required makes tracking your progress simple. You can take a quick 1 minute typing test during a break, or try a 10 minute typing test to build endurance. The test runs locally in your browser, keeping your data private while storing your words per minute average securely on your device.</p>
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>How to Type Faster and Improve Your WPM</h2>
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Raw speed is built on a foundation of good habits. If you want to improve your WPM, here are the core rules you need to follow:</p>
          <ul style={{ marginBottom: "32px", paddingLeft: "20px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <li style={{ marginBottom: "8px" }}><strong>Start with the home row keys (ASDF / JKL;):</strong> Your fingers need a resting place. Place your left hand on ASDF and your right hand on JKL;. Mastering this hand placement is the absolute bedrock of touch typing. Every keystroke originates here, helping your fingers memorize the distance to every other key.</li>
            <li style={{ marginBottom: "8px" }}><strong>Stop Looking at the Keyboard:</strong> It is tempting to look down at your hands while learning. Resist the urge. Keeping your eyes on the screen builds permanent muscle memory. It might slow your words per minute initially, but your brain will eventually map the keys automatically.</li>
            <li style={{ marginBottom: "8px" }}><strong>Fix Accuracy Before Chasing Speed:</strong> Trying to type faster than your hands can accurately move leads to errors. Adopt a typing accuracy test mindset: aim for 95% to 98% accuracy on every run. If you make too many mistakes, slow down. Once you stop wasting time hitting the backspace key, your net WPM will naturally increase.</li>
            <li><strong>Practice Daily for Best Results:</strong> Practicing for 15 minutes a day yields better results than typing for two hours once a week. Track your daily streak, try different modes, and watch your muscle memory improve steadily.</li>
          </ul>

          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>What is a Good Typing Speed?</h2>
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>If you just finished your first words per minute test, you might wonder how you compare. The average typing speed for an adult is around 40 WPM. Hitting 60 WPM means you are well above average and prepared for most professional environments.</p>
          <div style={{ overflowX: "auto", marginBottom: "24px" }}><table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-secondary)", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}><thead><tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left", color: "var(--text-primary)" }}><th style={{ padding: "12px 8px" }}>Speed</th><th style={{ padding: "12px 8px" }}>Level</th><th style={{ padding: "12px 8px" }}>Good for</th></tr></thead><tbody><tr style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "12px 8px" }}>Under 30 WPM</td><td style={{ padding: "12px 8px" }}>Beginner</td><td style={{ padding: "12px 8px" }}>Learning stage</td></tr><tr style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "12px 8px" }}>30–50 WPM</td><td style={{ padding: "12px 8px" }}>Average</td><td style={{ padding: "12px 8px" }}>Casual use</td></tr><tr style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "12px 8px" }}>50–70 WPM</td><td style={{ padding: "12px 8px" }}>Proficient</td><td style={{ padding: "12px 8px" }}>Most office jobs</td></tr><tr style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "12px 8px" }}>70–100 WPM</td><td style={{ padding: "12px 8px" }}>Fast</td><td style={{ padding: "12px 8px" }}>Data entry, coding</td></tr><tr><td style={{ padding: "12px 8px" }}>100+ WPM</td><td style={{ padding: "12px 8px" }}>Elite</td><td style={{ padding: "12px 8px" }}>Competitive / professional</td></tr></tbody></table></div>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Is 70 WPM good for typing? Yes, 70 to 80 WPM puts you in a highly proficient category. Anyone pushing past 100 WPM operates at an elite level. Regular practice will help you move up these tiers.</p>
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>Average Typing Speed by Age and for Students</h2>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Typing speed expectations change depending on age and experience. A good typing speed for students in middle school or high school usually ranges from 35 to 45 WPM, which is enough to handle assignments efficiently. For younger kids just learning to type, 15 to 25 WPM is perfectly normal.</p>
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Adults in the workforce typically average between 40 and 50 WPM, while seniors or those 60+ might average closer to 30 WPM depending on their digital habits. Checking your typing speed by age helps set realistic goals rather than comparing a beginner to a seasoned professional.</p>
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>Net WPM vs. Gross WPM: How is WPM Calculated?</h2>
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>To understand how to improve wpm, you need to know what WPM in typing actually means. Words per minute relies on a standard formula: total characters typed divided by 5 (the standard length of a "word"), divided by elapsed minutes.</p>
          <ul style={{ marginBottom: "32px", paddingLeft: "20px", color: "var(--text-secondary)", lineHeight: 1.6 }}><li style={{ marginBottom: "8px" }}><strong>Gross WPM:</strong> Your raw speed. It counts every character you type, even if the word is misspelled.</li><li><strong>Net WPM:</strong> Your true, usable speed. Uncorrected errors are subtracted from your gross speed. This is why accuracy matters if you type 120 Gross WPM but make 20 errors, your Net WPM drops significantly.</li></ul>
          
          <h2 style={{ color: "var(--text-primary)", fontSize: "20px", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>Frequently Asked Questions</h2>
          <details style={{ marginBottom: "12px", cursor: "pointer", background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}><summary style={{ color: "var(--text-primary)", fontWeight: 500 }}>What is a good typing speed in WPM?</summary><p style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>A good typing speed is 60 WPM or higher. The global average is around 40 WPM, while professionals like data entry specialists or programmers usually type between 70 and 90 WPM.</p></details>
          <details style={{ marginBottom: "12px", cursor: "pointer", background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}><summary style={{ color: "var(--text-primary)", fontWeight: 500 }}>How is WPM calculated?</summary><p style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>WPM is calculated by dividing the total correct characters typed by 5, then dividing by the total minutes elapsed. We measure net WPM, meaning we deduct uncorrected errors to give you a true accuracy adjusted score.</p></details>
          <details style={{ marginBottom: "12px", cursor: "pointer", background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}><summary style={{ color: "var(--text-primary)", fontWeight: 500 }}>What is the difference between net WPM and gross WPM?</summary><p style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Gross WPM measures your raw typing speed including typos. Net WPM subtracts your errors from that raw speed. Net WPM is the industry standard because it reflects usable, correctly spelled text.</p></details>
          <details style={{ marginBottom: "12px", cursor: "pointer", background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}><summary style={{ color: "var(--text-primary)", fontWeight: 500 }}>How long should I practice daily?</summary><p style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>You should practice for 15 to 20 minutes daily. Short, frequent sessions build muscle memory better than long, infrequent ones and help avoid typing fatigue.</p></details>
          <details style={{ marginBottom: "12px", cursor: "pointer", background: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}><summary style={{ color: "var(--text-primary)", fontWeight: 500 }}>Is this typing test free with no sign-up?</summary><p style={{ marginTop: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Yes, Typingspeedtest.live is a completely free wpm test with no sign-up needed. You can take unlimited tests, view error heat maps, and track your progress locally without creating an account.</p></details>
        </section>
      </main>
      <div style={{ opacity: isActive ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: isActive ? "none" : "auto" }}>
        <footer style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}><span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>Typing Speed Test</span><button onClick={reset} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center" }} aria-label="Restart test"><kbd style={{ padding: "1px 5px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)", marginRight: "6px", cursor: "pointer" }}>Tab</kbd>restart</button></footer>
      </div>
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} leaderboard={leaderboard} userName={userName} onUpdateName={updateUserName} />
    </div>
  );
}