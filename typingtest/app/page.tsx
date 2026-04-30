"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TypingBox, { TypingBoxHandle } from "./components/TypingBox";
import ResultModal from "./components/ResultModal";
import LeaderboardModal from "./components/LeaderboardModal";
import { generateWords } from "../lib/words";
import { useStats } from "../hooks/useStats";

type Mode = "time" | "words";
type TimeOption = number; // Unlocked from strict limits
type WordOption = number; // Unlocked from strict limits
type AppState = "idle" | "active" | "finished";

const WORD_BUFFER = 800;

export default function Home() {
  const [mode, setMode] = useState<Mode>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(30); // Defaulting to 30
  const [wordOption, setWordOption] = useState<WordOption>(30); // Defaulting to 30
  const [appState, setAppState] = useState<AppState>("idle");

  const [words, setWords] = useState<string[]>([]);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  const [result, setResult] = useState<{
    wpm: number;
    accuracy: number;
    errors: number;
    totalWords: number;
    timeTaken: number;
    isNewBest?: boolean;
    diff?: number;
  } | null>(null);

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const typingBoxRef = useRef<TypingBoxHandle>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const correctWordsRef = useRef(0);
  const totalWordsAttemptedRef = useRef(0);
  const errorsRef = useRef(0);

  const { streak, saveTestResult, history, leaderboard, userName, updateUserName } = useStats();

  useEffect(() => {
    const initialWords = generateWords(WORD_BUFFER);
    setWords(initialWords);
  }, []);

  useEffect(() => {
    setTimeLeft(timeOption);
  }, [timeOption]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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

    setResult({
      wpm: calculatedWpm,
      accuracy: calculatedAcc,
      errors: errorsRef.current,
      totalWords: correctWordsRef.current,
      timeTaken,
      isNewBest: statsResult.isNewBest,
      diff: statsResult.diff,
    });
    setAppState("finished");
  }, [mode, timeOption, stopTimer, saveTestResult]);

  const handleStart = useCallback(() => {
    setAppState("active");
    startTimeRef.current = Date.now();

    if (mode === "time") {
      let remaining = timeOption;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeLeft(remaining);
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
        if (elapsed > 0) setWpm(Math.round(correctWordsRef.current / elapsed));
        if (remaining <= 0) finish();
      }, 1000);
    }
  }, [mode, timeOption, finish]);

  const handleWordComplete = useCallback((correct: boolean) => {
    totalWordsAttemptedRef.current += 1;
    if (correct) {
      correctWordsRef.current += 1;
    } else {
      errorsRef.current += 1;
      setErrors(errorsRef.current);
    }
    const completed = correctWordsRef.current;
    setWordsCompleted(completed);
    const total = totalWordsAttemptedRef.current;
    setAccuracy(total === 0 ? 100 : Math.round(((total - errorsRef.current) / total) * 100));
    if (startTimeRef.current > 0) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      if (elapsed > 0) setWpm(Math.round(completed / elapsed));
    }
  }, []);

  const reset = useCallback(() => {
    stopTimer();
    correctWordsRef.current = 0;
    totalWordsAttemptedRef.current = 0;
    errorsRef.current = 0;
    startTimeRef.current = 0;

    setAppState("idle");
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setWordsCompleted(0);
    setTimeLeft(timeOption);
    setResult(null);

    // Give a buffer of words (+30) for word-mode to prevent running out
    const newWords = mode === "words" ? generateWords(wordOption + 30) : generateWords(WORD_BUFFER);
    setWords(newWords);
    typingBoxRef.current?.reset(newWords);
  }, [stopTimer, mode, timeOption, wordOption]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !isLeaderboardOpen) {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [reset, isLeaderboardOpen]);

  const handleModeChange = useCallback(
    (m: Mode) => {
      setMode(m);
      setTimeout(() => reset(), 0);
    },
    [reset]
  );

  const handleTimeOptionChange = useCallback(
    (t: TimeOption) => {
      setTimeOption(t);
      setTimeout(() => reset(), 0);
    },
    [reset]
  );

  const handleWordOptionChange = useCallback(
    (w: WordOption) => {
      setWordOption(w);
      setTimeout(() => reset(), 0);
    },
    [reset]
  );

  const isActive = appState === "active";
  const isFinished = appState === "finished";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        transition: "background var(--transition-slow)",
      }}
    >
      {/* Hidden H1 for SEO without breaking UI */}
      <h1 style={{ display: "none" }}>Free Typing Speed Test — Measure Your WPM and Accuracy Online</h1>

      {/* FOCUS MODE: Header smoothly fades out and disables interactions when actively typing */}
      <div style={{
        opacity: isActive ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: isActive ? "none" : "auto"
      }}>
        <Header
          mode={mode}
          timeOption={timeOption}
          wordOption={wordOption}
          onModeChange={handleModeChange}
          onTimeOptionChange={handleTimeOptionChange}
          onWordOptionChange={handleWordOptionChange}
          disabled={isActive}
          streak={streak}
          onLeaderboardClick={() => setIsLeaderboardOpen(true)}
        />
      </div>

      <main
        className="page-fade-in"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 0 80px",
        }}
      >
        <div className="container" style={{ width: "100%" }}>
          {!isFinished ? (
            <>
              <StatsBar
                wpm={wpm}
                accuracy={accuracy}
                errors={errors}
                timeLeft={mode === "time" ? timeLeft : null}
                wordsTyped={wordsCompleted}
                mode={mode}
                isActive={isActive}
              />

              {/* INCREASED MARGINS: Breathing room for the typing box */}
              <div style={{ maxWidth: "760px", margin: "48px auto 0" }}>
                {words.length > 0 && (
                  <TypingBox
                    ref={typingBoxRef}
                    words={words}
                    onStart={handleStart}
                    onWordComplete={handleWordComplete}
                    onFinish={finish}
                    isFinished={isFinished}
                    mode={mode}
                    totalWords={mode === "words" ? wordOption : undefined}
                    onRestart={reset}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="result-in" style={{ paddingTop: "24px" }}>
              {result && (
                <ResultModal
                  wpm={result.wpm}
                  accuracy={result.accuracy}
                  errors={result.errors}
                  totalWords={result.totalWords}
                  timeTaken={result.timeTaken}
                  mode={mode}
                  onRestart={reset}
                  isNewBest={result.isNewBest}
                  diff={result.diff}
                  history={history}
                />
              )}
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <section style={{
          marginTop: "80px",
          maxWidth: "720px",
          color: "var(--text-secondary)",
          fontSize: "14px",
          lineHeight: "1.6",
          textAlign: "left",
          padding: "0 20px"
        }}>

          <h2 style={{ color: "var(--text-primary)", fontSize: "18px", marginBottom: "12px" }}>
            What Is a Typing Speed Test?
          </h2>
          <p style={{ marginBottom: "24px" }}>
            A <strong>typing speed test</strong> measures how many <strong>words per minute (WPM)</strong> you can type accurately on a keyboard. Our free typing test gives you an instant WPM score and <strong>accuracy percentage</strong> the moment you finish, with zero registration required. We calculate your <strong>net WPM</strong> — the industry-standard metric that accounts for uncorrected errors, giving you an honest reflection of your real-world typing performance.
          </p>

          <h2 style={{ color: "var(--text-primary)", fontSize: "18px", marginBottom: "12px" }}>
            How to Improve Your Typing Speed
          </h2>
          <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}><strong>Learn the Home Row:</strong> Rest your fingers on ASDF and JKL;. Mastering this placement is the foundation of touch typing.</li>
            <li style={{ marginBottom: "8px" }}><strong>Stop Looking at the Keyboard:</strong> Force your eyes to stay on the screen to build muscle memory.</li>
            <li style={{ marginBottom: "8px" }}><strong>Fix Accuracy Before Chasing Speed:</strong> Aim for 95% accuracy or above. Speed follows accuracy naturally.</li>
            <li><strong>Practice Daily:</strong> 15 minutes every day beats two hours once a week. Track your daily streak to build a consistent habit.</li>
          </ul>

          <h2 style={{ color: "var(--text-primary)", fontSize: "18px", marginBottom: "16px" }}>
            Frequently Asked Questions
          </h2>

          <details style={{ marginBottom: "12px", cursor: "pointer" }}>
            <summary style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>What is a good typing speed in WPM?</summary>
            <p style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid var(--border)" }}>The average adult types around 40 WPM. A good typing speed is generally considered <strong>60 WPM or above</strong>. Professional typists typically reach 65–75 WPM, while advanced typists exceed 100 WPM.</p>
          </details>

          <details style={{ marginBottom: "12px", cursor: "pointer" }}>
            <summary style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>How is WPM calculated?</summary>
            <p style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid var(--border)" }}>WPM is calculated by dividing the total number of correctly typed characters by 5 (the standard "word" length), then dividing by the minutes elapsed. Our test measures <strong>net WPM</strong>, meaning uncorrected errors are deducted from your score.</p>
          </details>

          <details style={{ marginBottom: "12px", cursor: "pointer" }}>
            <summary style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>What is the difference between net WPM and gross WPM?</summary>
            <p style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid var(--border)" }}><strong>Gross WPM</strong> is your raw speed including errors. <strong>Net WPM</strong> subtracts those errors to measure your usable typing speed. Most employers use net WPM.</p>
          </details>

          <details style={{ marginBottom: "12px", cursor: "pointer" }}>
            <summary style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>How long should I practice daily?</summary>
            <p style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid var(--border)" }}><strong>15–20 minutes of focused daily practice</strong> is optimal. Consistent daily practice builds muscle memory faster than sporadic marathon sessions.</p>
          </details>

          <details style={{ marginBottom: "12px", cursor: "pointer" }}>
            <summary style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>Is this typing test free with no sign-up?</summary>
            <p style={{ marginTop: "8px", paddingLeft: "16px", borderLeft: "2px solid var(--border)" }}>Yes! TypingSpeedTest.live is completely free and requires no account. You can take unlimited tests instantly. Creating a free account is optional but unlocks streak tracking and the global leaderboard.</p>
          </details>

        </section>
      </main>

      {/* FOCUS MODE: Footer smoothly fades out and disables interactions when actively typing */}
      <div style={{
        opacity: isActive ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: isActive ? "none" : "auto"
      }}>
        <footer
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            Typing Speed Test
          </span>
          <span style={{ fontSize: "12px", color: "var(--border)" }}>·</span>

          <button
            onClick={reset}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Restart test"
          >
            <kbd
              style={{
                padding: "1px 5px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                fontSize: "11px",
                color: "var(--text-secondary)",
                marginRight: "6px",
                cursor: "pointer"
              }}
            >
              Tab
            </kbd>
            restart
          </button>
        </footer>
      </div>

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        leaderboard={leaderboard}
        userName={userName}
        onUpdateName={updateUserName}
      />
    </div>
  );
}