"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";

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

const TypingBox = forwardRef<TypingBoxHandle, TypingBoxProps>(function TypingBox(
  { words, onStart, onWordComplete, onFinish, isFinished, mode, totalWords, onRestart },
  ref
) {
  const [wordData, setWordData] = useState<WordData[]>(() =>
    words.map((w) => ({ chars: w.split("").map((c) => ({ char: c, state: "pending" as CharState })) }))
  );

  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // THE FIX: We now keep a permanent record of old words to stop Android from panicking
  const [lockedText, setLockedText] = useState("");
  const [currentInput, setCurrentInput] = useState("");

  const [hasStarted, setHasStarted] = useState(false);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [extraChars, setExtraChars] = useState<{ char: string; key: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const extraCharRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    reset(newWords: string[]) {
      setWordData(newWords.map((w) => ({
        chars: w.split("").map((c) => ({ char: c, state: "pending" as CharState })),
      })));
      setCurrentWordIdx(0);
      setLockedText(""); // Reset the Android text stream
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
      if (isFinished) return;
      if (e.key === "Tab") {
        e.preventDefault();
        onRestart();
      }
    },
    [isFinished, onRestart]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isFinished) return;
      const val = e.target.value;

      // HARD WALL: Prevent backspacing into already completed words.
      if (val.length < lockedText.length) {
        if (inputRef.current) inputRef.current.value = lockedText + currentInput;
        return;
      }

      const newCurrentInput = val.slice(lockedText.length);

      // Handle Spacebar / Word Completion via regex to catch Android weirdness
      if (/\s$/.test(newCurrentInput)) {
        const typedWord = newCurrentInput.trim();

        if (typedWord === "" && currentInput === "") {
          if (inputRef.current) inputRef.current.value = lockedText;
          return; // Prevent double spaces
        }

        if (!hasStarted) {
          setHasStarted(true);
          onStart();
        }

        const word = wordData[currentWordIdx];
        const correct = typedWord === word.chars.map(c => c.char).join("");
        onWordComplete(correct);

        if (mode === "words" && totalWords !== undefined && currentWordIdx + 1 >= totalWords) {
          onFinish();
          return;
        }

        // Lock the word in the stream so Android keeps its context
        setLockedText(lockedText + newCurrentInput);
        setCurrentInput("");
        setCurrentWordIdx(p => p + 1);
        setExtraChars([]);
        return;
      }

      // Handle Regular Typing
      if (!hasStarted && val.length > lockedText.length) {
        setHasStarted(true);
        onStart();
      }

      setCurrentInput(newCurrentInput);

      // Instantly evaluate and color the word
      const word = wordData[currentWordIdx];
      if (word) {
        setWordData(prev => {
          const updated = prev.map(w => ({ chars: w.chars.map(c => ({ ...c })) }));
          const currentWordChars = updated[currentWordIdx].chars;

          for (let i = 0; i < currentWordChars.length; i++) {
            if (i < newCurrentInput.length) {
              currentWordChars[i].state = newCurrentInput[i] === currentWordChars[i].char ? "correct" : "incorrect";
            } else {
              currentWordChars[i].state = "pending";
            }
          }
          return updated;
        });

        if (newCurrentInput.length > word.chars.length) {
          const extraStr = newCurrentInput.slice(word.chars.length).slice(0, 8);
          setExtraChars(extraStr.split("").map((char, i) => ({ char, key: Date.now() + i })));
        } else {
          setExtraChars([]);
        }
      }
    },
    [lockedText, isFinished, hasStarted, currentInput, currentWordIdx, wordData, mode, totalWords, onStart, onWordComplete, onFinish]
  );

  const renderWord = (word: WordData, wordIdx: number) => {
    const isCurrent = wordIdx === currentWordIdx;
    const isPast = wordIdx < currentWordIdx;

    return (
      <span
        key={wordIdx}
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
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "var(--text-primary)", borderRadius: "1px" }}
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

        {isCurrent && extraChars.map((ec, i) => (
          <span key={ec.key} ref={(el) => { extraCharRefs.current[i] = el; }} style={{ color: "var(--typing-incorrect)", opacity: 0.8 }}>
            {ec.char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div style={{ position: "relative", cursor: "text" }} onClick={focusInput}>
      <input
        ref={inputRef}
        value={lockedText + currentInput} // The core trick that fixes Android
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        data-gramm="false"
        disabled={isFinished}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />

      <div ref={containerRef} style={{ position: "relative", maxHeight: "210px", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none" }}>
        {!isFinished && (
          <span
            style={{
              position: "absolute",
              top: caretPos.top + 1,
              left: caretPos.left,
              width: "2px",
              height: "1.6em",
              background: "var(--text-primary)",
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

        <div className="typing-text" style={{ display: "flex", flexWrap: "wrap", fontSize: "22px", lineHeight: 2.3, fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, letterSpacing: "0.3px" }}>
          {wordData.map((word, i) => renderWord(word, i))}
        </div>
      </div>

      {!hasStarted && (
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "14px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
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
              transition: "all 0.1s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--border)"}
            onMouseOut={(e) => e.currentTarget.style.background = "var(--surface)"}
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