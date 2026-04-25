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
type TimeOption = 15 | 30 | 60;
type WordOption = 10 | 25 | 50;
type AppState = "idle" | "active" | "finished";

const WORD_BUFFER = 150;

export default function Home() {
  const [mode, setMode] = useState<Mode>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [appState, setAppState] = useState<AppState>("idle");

  // HYDRATION FIX: Start with empty words to match server-side render
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

  // HYDRATION FIX: Generate initial words ONLY after the component mounts on the client
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

  // 1. Add 'async' here
  const finish = useCallback(async () => {
    stopTimer();
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const timeTaken = mode === "time" ? timeOption : elapsed;
    const finalWpm = Math.round((correctWordsRef.current / timeTaken) * 60);
    const total = totalWordsAttemptedRef.current;
    const finalAcc = total === 0 ? 100 : Math.round(((total - errorsRef.current) / total) * 100);

    const calculatedWpm = Math.max(0, finalWpm);
    const calculatedAcc = Math.max(0, finalAcc);

    // 2. Add 'await' here
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

              <div style={{ marginTop: "24px", maxWidth: "720px", margin: "24px auto 0" }}>
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
      </main>

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
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          <kbd
            style={{
              padding: "1px 5px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              fontSize: "11px",
              color: "var(--text-secondary)",
              marginRight: "5px",
            }}
          >
            Tab
          </kbd>{" "}
          restart
        </span>
      </footer>

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