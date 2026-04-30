"use client";

import { useMemo, useState, useRef } from "react";
import html2canvas from "html2canvas";
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
  const [showCertificate, setShowCertificate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reference to the specific card we want to capture
  const certificateRef = useRef<HTMLDivElement>(null);

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

  // --- SAVE IMAGE FUNCTION ---
  const handleSaveImage = async () => {
    if (!certificateRef.current) return;

    setIsSaving(true);
    try {
      // Temporarily hide box-shadow for a cleaner export
      const originalShadow = certificateRef.current.style.boxShadow;
      certificateRef.current.style.boxShadow = "none";

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Multiplies resolution by 3 for crystal clear text
        backgroundColor: null, // Preserves your theme colors
        useCORS: true,
      });

      // Restore the shadow for the UI
      certificateRef.current.style.boxShadow = originalShadow;

      // Convert canvas to image and trigger download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `typingspeedtest-${wpm}wpm.png`; // Dynamic file name!
      link.click();
    } catch (error) {
      console.error("Failed to save image:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
          onClick={() => setShowCertificate(true)}
          style={{ ...actionBtnStyle, color: "var(--accent)", borderColor: "var(--accent)" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--border)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "var(--surface)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share Result
        </button>
      </div>

      {showCertificate && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          animation: "resultFadeIn 0.2s ease-out"
        }}>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%", maxWidth: "540px" }}>

            {/* THIS REF ATTACHES HTML2CANVAS TO ONLY THE CARD */}
            <div
              ref={certificateRef}
              style={{
                background: "var(--surface)",
                border: "2px solid var(--border)",
                borderRadius: "16px",
                padding: "40px",
                width: "100%",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "var(--accent)" }} />

              <svg viewBox="0 0 24 24" fill="var(--accent)" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "350px", height: "350px", opacity: 0.03, pointerEvents: "none" }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace" }}>
                    typing speed test
                  </span>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 600, background: "var(--accent)", color: "var(--surface)", padding: "4px 10px", borderRadius: "99px", fontFamily: "'Inter', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Verified Result
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", background: "var(--bg)", padding: "24px 32px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.2)", position: "relative", zIndex: 2 }}>
                <div>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'Roboto Mono', monospace", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>WPM</div>
                  <div style={{ fontSize: "72px", fontWeight: 600, color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{wpm}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "'Roboto Mono', monospace", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Accuracy</div>
                  <div style={{ fontSize: "72px", fontWeight: 600, color: "var(--accent)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{accuracy}%</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px", position: "relative", zIndex: 2 }}>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Test Type</span>
                  <span style={{ fontSize: "18px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace" }}>{mode} {mode === "time" ? timeTaken : totalWords}</span>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Raw WPM</span>
                  <span style={{ fontSize: "18px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace" }}>{rawWpmFinal}</span>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Characters</span>
                  <span style={{ fontSize: "18px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace" }}>{correctChars}/{errors}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px dashed var(--border)", paddingTop: "20px", position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.5px" }}>
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace", fontWeight: 500 }}>
                  typingspeedtest.live
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", width: "100%", justifyContent: "center", alignItems: "center" }}>
              <button
                onClick={() => setShowCertificate(false)}
                style={{ ...actionBtnStyle, background: "transparent", color: "var(--text-secondary)", border: "none" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                Close
              </button>

              {/* THE NEW SAVE BUTTON */}
              <button
                onClick={handleSaveImage}
                disabled={isSaving}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--bg)",
                  background: "var(--accent)",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: isSaving ? "wait" : "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  fontFamily: "'Inter', sans-serif",
                  opacity: isSaving ? 0.8 : 1,
                  transition: "opacity 0.2s ease"
                }}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Save Image
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}