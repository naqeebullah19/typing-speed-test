"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  memo,
} from "react";

export interface TypingBoxHandle {
  reset: (words: string[]) => void;
}

interface TypingBoxProps {
  words: string[];
  onStart: () => void;
  onWordComplete: (correct: boolean) => void;
  onFinish: () => void;
  isFinished: boolean;
  mode: "time" | "words";
  totalWords?: number;
  onRestart: () => void;
}

type CharState = "pending" | "correct" | "incorrect";

interface WordData {
  chars: { char: string; state: CharState }[];
}

const EMPTY_EXTRA_CHARS: { char: string; key: number }[] = [];

const MemoizedWord = memo(function MemoizedWord({
  word,
  wordIdx,
  isCurrent,
  isPast,
  extraChars,
  wordRefs,
  charRefs,
  extraCharRefs,
}: {
  word: WordData;
  wordIdx: number;
  isCurrent: boolean;
  isPast: boolean;
  extraChars: { char: string; key: number }[];
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  charRefs: React.MutableRefObject<(HTMLSpanElement | null)[][]>;
  extraCharRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
}) {
  return (
    <span
      ref={(el) => { wordRefs.current[wordIdx] = el; }}
      style={{
        display: "inline-flex",
        position: "relative",
        marginRight: "14px",
        marginBottom: "8px",
        paddingBottom: "4px",
      }}
    >
      {isCurrent && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "var(--accent)",
            borderRadius: "1px",
          }}
        />
      )}

      {word.chars.map((c, charIdx) => {
        let color = "var(--typing-upcoming)";
        if (isPast) {
          color = c.state === "correct" ? "var(--typing-correct)" : "var(--typing-incorrect)";
        } else if (isCurrent) {
          if (c.state === "correct") color = "var(--typing-correct)";
          else if (c.state === "incorrect") color = "var(--typing-incorrect)";
          else color = "var(--typing-current)";
        }

        return (
          <span
            key={charIdx}
            ref={(el) => {
              if (!charRefs.current[wordIdx]) charRefs.current[wordIdx] = [];
              charRefs.current[wordIdx][charIdx] = el;
            }}
            style={{
              color,
              transition: "color 100ms ease",
              textDecoration: c.state === "incorrect" ? "underline" : "none",
              textDecorationColor: "var(--typing-incorrect)",
              textUnderlineOffset: "6px",
              textDecorationThickness: "2px",
            }}
          >
            {c.char}
          </span>
        );
      })}

      {isCurrent &&
        extraChars.map((ec, i) => (
          <span
            key={ec.key}
            ref={(el) => { extraCharRefs.current[i] = el; }}
            style={{ color: "var(--typing-incorrect)", opacity: 0.8 }}
          >
            {ec.char}
          </span>
        ))}
    </span>
  );
});

const TypingBox = forwardRef<TypingBoxHandle, TypingBoxProps>(function TypingBox(
  { words, onStart, onWordComplete, onFinish, isFinished, mode, totalWords, onRestart },
  ref
) {
  const [wordData, setWordData] = useState<WordData[]>(() =>
    words.map((w) => ({
      chars: w.split("").map((c) => ({ char: c, state: "pending" as CharState })),
    }))
  );

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [extraChars, setExtraChars] = useState<{ char: string; key: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const extraCharRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const stateRef = useRef({
    currentInput,
    currentWordIdx,
    wordData,
    hasStarted,
  });
  useEffect(() => {
    stateRef.current = { currentInput, currentWordIdx, wordData, hasStarted };
  });

  useImperativeHandle(ref, () => ({
    reset(newWords: string[]) {
      setWordData(
        newWords.map((w) => ({
          chars: w.split("").map((c) => ({ char: c, state: "pending" as CharState })),
        }))
      );
      setCurrentWordIdx(0);
      setCurrentInput("");
      setHasStarted(false);
      setExtraChars([]);
      charRefs.current = [];
      extraCharRefs.current = [];
      wordRefs.current = [];
    },
  }));

  const focusInput = useCallback(() => inputRef.current?.focus(), []);
  useEffect(() => { focusInput(); }, [focusInput]);

  // 🚨 AGGRESSIVE FOCUS FIX 🚨
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      // 1. Catch TAB anywhere on the entire page and force a restart
      if (e.key === "Tab") {
        e.preventDefault(); // Stops the browser from moving focus to the next button
        onRestart();
        inputRef.current?.focus(); // Immediately lock focus back to typing
        return;
      }

      // 2. Catch typing anywhere on the page and steal focus back
      // If the user presses a letter, number, space, or backspace while unfocused...
      const isTypingKey = e.key.length === 1 || e.key === "Backspace";
      if (
        document.activeElement !== inputRef.current &&
        isTypingKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isFinished, onRestart]);

  useEffect(() => {
    const word = wordData[currentWordIdx];
    if (!word || !containerRef.current) return;

    const inputLen = currentInput.length;
    const wordLen = word.chars.length;
    const extraLen = extraChars.length;

    let targetEl: HTMLSpanElement | null = null;
    let afterEl = false;

    if (inputLen === 0) {
      targetEl = charRefs.current[currentWordIdx]?.[0] ?? null;
      afterEl = false;
    } else if (inputLen <= wordLen) {
      targetEl = charRefs.current[currentWordIdx]?.[inputLen - 1] ?? null;
      afterEl = true;
    } else {
      targetEl = extraCharRefs.current[extraLen - 1] ?? null;
      afterEl = true;
    }

    if (!targetEl) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = targetEl.getBoundingClientRect();

    setCaretPos({
      top: eRect.top - cRect.top + containerRef.current.scrollTop,
      left: (afterEl ? eRect.right : eRect.left) - cRect.left + containerRef.current.scrollLeft,
    });
  }, [currentInput, currentWordIdx, wordData, extraChars]);

  useEffect(() => {
    const el = wordRefs.current[currentWordIdx];
    if (!el || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    if (eRect.top - cRect.top > cRect.height * 0.5) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [currentWordIdx]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Local Tab intercept (Global listener handles it if unfocused)
      if (isFinished) return;
      if (e.key === "Tab") {
        e.preventDefault();
        onRestart();
      }
    },
    [isFinished, onRestart]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const rawValue = e.target.value;
    const { currentInput, currentWordIdx, wordData, hasStarted } = stateRef.current;

    if (currentInput === "" && rawValue.trim() === "") {
      return;
    }

    if (rawValue.includes(" ")) {
      const parts = rawValue.split(" ");
      const typedWord = parts[0];

      if (!hasStarted) {
        setHasStarted(true);
        onStart();
      }

      const word = wordData[currentWordIdx];
      const isCorrect = typedWord === word.chars.map((c) => c.char).join("");
      onWordComplete(isCorrect);

      if (mode === "words" && totalWords !== undefined && currentWordIdx + 1 >= totalWords) {
        onFinish();
        return;
      }

      setCurrentInput(parts.slice(1).join(" "));
      setCurrentWordIdx((p) => p + 1);
      setExtraChars([]);

      setWordData((prev) => {
        const updated = [...prev];
        const currentChars = prev[currentWordIdx].chars.map((c) => ({ ...c }));
        for (let i = 0; i < currentChars.length; i++) {
          currentChars[i].state = i < typedWord.length && typedWord[i] === currentChars[i].char ? "correct" : "incorrect";
        }
        updated[currentWordIdx] = { chars: currentChars };
        return updated;
      });

      return;
    }

    if (!hasStarted && rawValue.length > 0) {
      setHasStarted(true);
      onStart();
    }

    setCurrentInput(rawValue);

    const word = wordData[currentWordIdx];
    if (word) {
      setWordData((prev) => {
        const updated = [...prev];
        const currentChars = prev[currentWordIdx].chars.map((c) => ({ ...c }));

        for (let i = 0; i < currentChars.length; i++) {
          if (i < rawValue.length) {
            currentChars[i].state = rawValue[i] === currentChars[i].char ? "correct" : "incorrect";
          } else {
            currentChars[i].state = "pending";
          }
        }
        updated[currentWordIdx] = { chars: currentChars };
        return updated;
      });

      if (rawValue.length > word.chars.length) {
        const extraStr = rawValue.slice(word.chars.length).slice(0, 8);
        setExtraChars(extraStr.split("").map((char, i) => ({ char, key: Date.now() + i })));
      } else {
        setExtraChars([]);
      }
    }
  }, [isFinished, onStart, onWordComplete, onFinish, mode, totalWords]);

  return (
    <div style={{ position: "relative", cursor: "text" }} onClick={focusInput}>

      <input
        ref={inputRef}
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        data-gramm="false"
        disabled={isFinished}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />

      <div
        ref={containerRef}
        style={{
          position: "relative",
          maxHeight: "210px",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {!isFinished && (
          <span
            style={{
              position: "absolute",
              top: caretPos.top + 13,
              left: caretPos.left,
              width: "2px",
              height: "24px",
              background: "var(--accent)",
              borderRadius: "1px",
              animation: "caretBlink 1s infinite",
              transition: "top 90ms cubic-bezier(0.4,0,0.2,1), left 90ms cubic-bezier(0.4,0,0.2,1)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        )}

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "20px", background: "linear-gradient(to bottom, var(--bg), transparent)", zIndex: 5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "linear-gradient(to top, var(--bg), transparent)", zIndex: 5, pointerEvents: "none" }} />

        <div
          className="typing-text"
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: "22px",
            lineHeight: 2.3,
            fontFamily: "'Roboto Mono', monospace",
            fontWeight: 400,
            letterSpacing: "0.3px",
          }}
        >
          {wordData.map((word, i) => (
            <MemoizedWord
              key={i}
              word={word}
              wordIdx={i}
              isCurrent={i === currentWordIdx}
              isPast={i < currentWordIdx}
              extraChars={i === currentWordIdx ? extraChars : EMPTY_EXTRA_CHARS}
              wordRefs={wordRefs}
              charRefs={charRefs}
              extraCharRefs={extraCharRefs}
            />
          ))}
        </div>
      </div>

      {!hasStarted && (
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "14px",
            color: "var(--text-muted)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span>Start typing to begin —</span>
          <button
            onClick={onRestart}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.1s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--border)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "var(--surface)")}
          >
            <kbd style={{ fontSize: "11px", color: "var(--text-secondary)", opacity: 0.8 }}>Tab</kbd>
            Restart Test
          </button>
        </div>
      )}
    </div>
  );
});

export default TypingBox;