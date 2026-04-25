"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
    name: string;
    wpm: number;
    date: number;
}

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaderboard: LeaderboardEntry[];
    userName: string;
    onUpdateName: (name: string) => void;
}

export default function LeaderboardModal({
    isOpen,
    onClose,
    leaderboard,
    userName,
    onUpdateName,
}: LeaderboardModalProps) {
    const [localName, setLocalName] = useState(userName);

    // Sync local name with parent when opened
    useEffect(() => {
        if (isOpen) setLocalName(userName);
    }, [isOpen, userName]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "var(--bg-overlay)",
                backdropFilter: "blur(4px)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeInResult 200ms ease both",
            }}
            onClick={onClose} // Close when clicking background
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>
                        Top 10 Leaderboard
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "18px",
                            padding: "4px",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Name Input */}
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        onBlur={() => onUpdateName(localName || "Guest")} // Save when user clicks away
                        onKeyDown={(e) => e.key === "Enter" && onUpdateName(localName || "Guest")} // Save on Enter
                        maxLength={15}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            color: "var(--text-primary)",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 150ms ease",
                        }}
                        placeholder="Enter your name..."
                    />
                </div>

                {/* Leaderboard List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {leaderboard.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                            No scores yet. Complete a test to rank up!
                        </div>
                    ) : (
                        leaderboard.map((entry, i) => {
                            const isFirst = i === 0;
                            const isCurrentUser = entry.name === userName;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 12px",
                                        background: isCurrentUser ? "var(--bg-secondary)" : "transparent",
                                        borderRadius: "6px",
                                        border: isCurrentUser ? "1px solid var(--border)" : "1px solid transparent",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: isFirst ? 700 : 500, color: isFirst ? "var(--streak-color)" : "var(--text-muted)", fontFamily: "'Inter', sans-serif", width: "16px" }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ fontSize: "14px", fontWeight: isCurrentUser ? 600 : 400, color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>
                                            {entry.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: "14px", fontWeight: 600, color: isFirst ? "var(--streak-color)" : "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>
                                        {entry.wpm} <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--text-muted)" }}>WPM</span>
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}