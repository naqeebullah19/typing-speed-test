"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import html2canvas from "html2canvas";

function CertificateContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [appliedName, setAppliedName] = useState("Your Name Here");
  const [isSaving, setIsSaving] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const wpm = searchParams.get("wpm") || "0";
  const acc = searchParams.get("acc") || "0";
  const raw = searchParams.get("raw") || "0";
  const mode = searchParams.get("mode") || "time";
  const time = searchParams.get("time") || "0";
  const words = searchParams.get("words") || "0";
  const chars = searchParams.get("chars") || "0/0";

  const testTypeDisplay = `${mode} ${mode === "time" ? time : words}`;

  // The text that wraps around the circular stamp
  const sealText = "★ TYPINGSPEEDTEST.LIVE ★ OFFICIAL ★ VERIFIED ";
  const sealChars = sealText.split("");

  const handleApplyName = () => {
    if (name.trim()) {
      setAppliedName(name.trim());
    }
  };

  const handleSavePNG = async () => {
    if (!certificateRef.current) return;
    setIsSaving(true);
    try {
      // Temporarily hide shadows for cleaner export
      const originalShadow = certificateRef.current.style.boxShadow;
      certificateRef.current.style.boxShadow = "none";

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, 
        backgroundColor: null, 
        useCORS: true,
      });

      certificateRef.current.style.boxShadow = originalShadow;

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${appliedName.replace(/\s+/g, "_")}_Typing_Certificate.png`;
      link.click();
    } catch (error) {
      console.error("Failed to save image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "60px", background: "var(--bg)" }}>
      
      {/* 1. NEW MAIN SITE HEADER */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                typingspeedtest.live
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
               
              </div>
            </div>
          </Link>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Take a test</Link>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>About</Link>
          </div>
        </div>
      </header>

      {/* 2. CONTROL BAR */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to test
            </Link>

            <button onClick={handleSavePNG} disabled={isSaving} style={{ background: "var(--accent)", color: "var(--bg)", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 600, cursor: isSaving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter', sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              {isSaving ? "Saving Image..." : "Download PNG"}
            </button>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "flex-end", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Your name on certificate</label>
              <input 
                type="text" 
                placeholder="e.g., Naqeebullah Khan" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyName()}
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: "2px solid var(--accent)", color: "var(--text-primary)", fontSize: "18px", padding: "8px 0", outline: "none", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <button onClick={handleApplyName} style={{ background: "var(--accent)", border: "none", color: "var(--bg)", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Apply Name
            </button>
          </div>

        </div>
      </div>

      {/* 3. CERTIFICATE PREVIEW AREA */}
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", display: "flex", justifyContent: "center" }}>
        
        <div 
          ref={certificateRef}
          style={{
            background: "var(--bg)",
            border: "2px solid var(--border)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "900px",
            padding: "60px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)"
          }}
        >
          {/* Decorative Corner Accents */}
          <div style={{ position: "absolute", top: "24px", left: "24px", width: "40px", height: "40px", borderTop: "4px solid var(--accent)", borderLeft: "4px solid var(--accent)" }} />
          <div style={{ position: "absolute", top: "24px", right: "24px", width: "40px", height: "40px", borderTop: "4px solid var(--accent)", borderRight: "4px solid var(--accent)" }} />
          <div style={{ position: "absolute", bottom: "24px", left: "24px", width: "40px", height: "40px", borderBottom: "4px solid var(--accent)", borderLeft: "4px solid var(--accent)" }} />
          <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "40px", height: "40px", borderBottom: "4px solid var(--accent)", borderRight: "4px solid var(--accent)" }} />

          {/* Faint Background Watermark */}
          <svg viewBox="0 0 24 24" fill="var(--accent)" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "450px", height: "450px", opacity: 0.03, pointerEvents: "none" }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>

          {/* Certificate Title */}
          <div style={{ textAlign: "center", marginBottom: "40px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <h1 style={{ fontSize: "28px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace", margin: 0 }}>typing speed test</h1>
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: "32px" }}>typingspeedtest.live</div>
            
            <h2 style={{ fontSize: "48px", color: "var(--accent)", fontFamily: "'Inter', serif", fontWeight: 400, margin: "0 0 24px 0", letterSpacing: "-1px" }}>Certificate of Excellence</h2>
            
            <div style={{ display: "inline-block", background: "var(--surface)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "6px 20px", borderRadius: "99px", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
              Verified Result
            </div>
          </div>

          {/* User Name Area */}
          <div style={{ textAlign: "center", marginBottom: "56px", position: "relative", zIndex: 2 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>This is to certify that</p>
            <div style={{ fontSize: "72px", color: "var(--text-primary)", fontFamily: "Georgia, serif", fontStyle: "italic", borderBottom: "1px solid var(--border)", display: "inline-block", padding: "0 40px 8px 40px", minWidth: "500px" }}>
              {appliedName}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontFamily: "'Inter', sans-serif", marginTop: "24px" }}>has successfully completed a typing proficiency test with the following results:</p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "60px", position: "relative", zIndex: 2 }}>
            {[
              { label: "WPM", value: wpm },
              { label: "Accuracy", value: `${acc}%` },
              { label: "Raw WPM", value: raw },
              { label: "Test Type", value: testTypeDisplay },
              { label: "Characters", value: chars }
            ].map((stat, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px 12px", textAlign: "center", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: "32px", color: "var(--accent)", fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Footer & NEW OFFICIAL SEAL */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 2 }}>
            
            {/* Date Section */}
            <div style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "16px", color: "var(--text-primary)", fontFamily: "'Roboto Mono', monospace", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "8px", minWidth: "160px" }}>
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Date Issued</div>
            </div>

            {/* Signature Area */}
            <div style={{ textAlign: "center", paddingBottom: "10px" }}>
              <div style={{ fontSize: "28px", color: "var(--text-secondary)", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "12px" }}>Typing Speed Test</div>
              <div style={{ width: "240px", height: "1px", background: "var(--border)", margin: "0 auto 8px auto" }} />
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Certification Authority</div>
            </div>

            {/* 4. NEW HIGH-DETAIL CSS BADGE */}
            <div style={{ width: "130px", height: "130px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", transform: "rotate(-5deg)" }}>
              
              {/* Outer Thick Border Ring */}
              <div style={{ position: "absolute", inset: 0, border: "4px solid var(--accent)", borderRadius: "50%", opacity: 0.9 }} />
              
              {/* Circular Text Loop (Safe for html2canvas) */}
              <div style={{ position: "absolute", inset: 0 }}>
                {sealChars.map((char, i) => {
                  const angle = i * (360 / sealChars.length);
                  return (
                    <div key={i} style={{
                      position: "absolute",
                      left: "50%",
                      top: "4px",
                      height: "61px", // Radius from center
                      marginLeft: "-5px",
                      width: "10px",
                      textAlign: "center",
                      transformOrigin: "bottom center",
                      transform: `rotate(${angle}deg)`,
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "var(--accent)",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {char}
                    </div>
                  );
                })}
              </div>

              {/* Inner Badge Circle */}
              <div style={{
                position: "absolute",
                inset: "24px",
                background: "var(--surface)", 
                borderRadius: "50%",
                border: "1.5px solid var(--accent)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1" style={{ marginBottom: "2px" }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent)", letterSpacing: "0px", lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>CERTIFIED</div>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>Expert</div>
              </div>

              {/* Authenticated Pill */}
              <div style={{
                position: "absolute",
                bottom: "-6px",
                background: "var(--accent)",
                color: "var(--bg)", 
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.5px",
                zIndex: 3,
                border: "3px solid var(--surface)", 
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}>
                AUTHENTICATED
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "50px", color: "var(--text-muted)" }}>Loading certificate...</div>}>
      <CertificateContent />
    </Suspense>
  );
}