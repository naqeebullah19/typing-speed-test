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

const TypingBox = forwardRef<TypingBoxHandle, TypingBoxProps>(function TypingBox(
  { words, onStart, onWordComplete, onFinish, isFinished, mode, totalWords, onRestart },
  ref
) {
  // THE SILVER BULLET: A single string holding everything typed. No more chopping up state!
  const [text, setText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

  const lockedSpacesRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const wordRefs = useRef<(HTMLElement | null)[]>([]);
  const charRefs = useRef<(HTMLElement | null)[][]>([]);
  const extraCharRefs = useRef<(HTMLElement | null)[][]>([]);

  useImperativeHandle(ref, () => ({
    reset() {
      setText("");
      lockedSpacesRef.current = 0;
      setHasStarted(false);
      charRefs.current = [];
      extraCharRefs.current = [];
      wordRefs.current = [];
    },
  }));

  const focusInput = useCallback(() => inputRef.current?.focus(), []);
  useEffect(() => { focusInput(); }, [focusInput]);

  // Derived mathematical state
  const typedWordsArray = text.split(" ");
  const currentWordIdx = lockedSpacesRef.current;
  const currentInputLen = (typedWordsArray[currentWordIdx] || "").length;

  // Caret Tracking
  useEffect(() => {
    const targetWord = words[currentWordIdx];
    if (!targetWord || !containerRef.current) return;

    let targetEl: HTMLElement | null = null;
    let afterEl = false;

    if (currentInputLen === 0) {
      targetEl = charRefs.current[currentWordIdx]?.[0] ?? null;
      afterEl = false;
    } else if (currentInputLen <= targetWord.length) {
      targetEl = charRefs.current[currentWordIdx]?.[currentInputLen - 1] ?? null;
      afterEl = true;
    } else {
      const extraIdx = currentInputLen - targetWord.length - 1;
      targetEl = extraCharRefs.current[currentWordIdx]?.[extraIdx] ?? null;
      afterEl = true;
    }

    if (!targetEl) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = targetEl.getBoundingClientRect();

    setCaretPos({
      top: eRect.top - cRect.top + containerRef.current.scrollTop,
      left: (afterEl ? eRect.right : eRect.left) - cRect.left + containerRef.current.scrollLeft,
    });
  }, [text, currentWordIdx, currentInputLen, words]);

  // Scroll Tracking
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
      let val = e.target.value;

      // 1. Prevent leading spaces
      if (val.startsWith(" ")) {
        val = val.trimStart();
      }

      // 2. Prevent double spaces (Android double tap glitch)
      val = val.replace(/  +/g, " ");

      const currentSpaces = val.match(/ /g)?.length || 0;

      // 3. HARD WALL: Prevent backspacing into completed words.
      if (currentSpaces < lockedSpacesRef.current) {
        if (inputRef.current) inputRef.current.value = text;
        return; // Reject the backspace, protect the stats
      }

      // 4. Process Word Completions naturally
      if (currentSpaces > lockedSpacesRef.current) {
        if (!hasStarted) {
          setHasStarted(true);
          onStart();
        }

        const valWords = val.split(" ");
        for (let i = lockedSpacesRef.current; i < currentSpaces; i++) {
          const typedWord = valWords[i];
          const targetWord = words[i];
          onWordComplete(typedWord === targetWord);

          if (mode === "words" && totalWords !== undefined && i + 1 >= totalWords) {
            onFinish();
            setText(val);
            return;
          }
        }
        lockedSpacesRef.current = currentSpaces;
      } else if (!hasStarted && val.length > 0) {
        setHasStarted(true);
        onStart();
      }

      setText(val); // Sync perfectly with Android Gboard
    },
    [isFinished, hasStarted, text, mode, totalWords, words, onStart, onWordComplete, onFinish]
  );

  const renderWord = (targetWord: string, wordIdx: number) => {
    const isCurrent = wordIdx === currentWordIdx;
    const isPast = wordIdx < currentWordIdx;
    const typedWord = typedWordsArray[wordIdx] || "";

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

        {targetWord.split("").map((char, charIdx) => {
          let color = "var(--typing-upcoming)";
          let isUnderline = false;

          if (isPast) {
            const typedChar = typedWord[charIdx];
            if (typedChar === char) {
              color = "var(--typing-correct)";
            } else {
              color = "var(--typing-incorrect)";
              isUnderline = true;
            }
          } else if (isCurrent) {
            if (charIdx < typedWord.length) {
              const typedChar = typedWord[charIdx];
              if (typedChar === char) {
                color = "var(--typing-correct)";
              } else {
                color = "var(--typing-incorrect)";
                isUnderline = true;
              }
            } else {
              color = "var(--typing-current)";
            }
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
                textDecoration: isUnderline ? "underline" : "none",
                textDecorationColor: "var(--typing-incorrect)",
                textUnderlineOffset: "6px",
                textDecorationThickness: "2px",
              }}
            >
              {char}
            </span>
          );
        })}

        {/* Extra characters typed past the word length */}
        {(isCurrent || isPast) && typedWord.length > targetWord.length && (
          typedWord.slice(targetWord.length).slice(0, 8).split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                if (!extraCharRefs.current[wordIdx]) extraCharRefs.current[wordIdx] = [];
                extraCharRefs.current[wordIdx][i] = el;
              }}
              style={{ color: "var(--typing-incorrect)", opacity: 0.8 }}
            >
              {char}
            </span>
          ))
        )}
      </span>
    );
  };

  return (
    <div style={{ position: "relative", cursor: "text" }} onClick={focusInput}>
      <input
        ref={inputRef}
        value={text}
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
          {words.map((word, i) => renderWord(word, i))}
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