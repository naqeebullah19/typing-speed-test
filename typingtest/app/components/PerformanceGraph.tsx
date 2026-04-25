"use client";
import { useState } from "react";

export default function PerformanceGraph({ history }: { history: { wpm: number, accuracy: number }[] }) {
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, wpm: number } | null>(null);

    if (!history || history.length < 2) return null;

    const data = [...history].reverse();
    const wpms = data.map(d => d.wpm);
    const maxWpm = Math.max(...wpms);
    const minWpm = Math.min(...wpms);
    const range = maxWpm - minWpm || 10;

    const width = 600;
    const height = 120;
    const paddingX = 30;
    const paddingY = 20;

    // Pre-calculate points so we can use them for the hover logic
    const points = data.map((d, i) => ({
        x: paddingX + (i / (data.length - 1)) * (width - paddingX * 2),
        y: height - paddingY - ((d.wpm - minWpm) / range) * (height - paddingY * 2),
        wpm: d.wpm
    }));

    const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");

    return (
        <div style={{ width: "100%", height: "140px", marginTop: "20px", position: "relative" }}>
            {/* Tooltip */}
            {hoveredPoint && (
                <div style={{
                    position: "absolute",
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: hoveredPoint.y - 30,
                    transform: "translateX(-50%)",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#f87171",
                    pointerEvents: "none",
                    zIndex: 10
                }}>
                    {hoveredPoint.wpm} WPM
                </div>
            )}

            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
                {/* Subtle Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={width} y2={paddingY} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
                <line x1={paddingX} y1={height - paddingY} x2={width} y2={height - paddingY} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />

                {/* The Performance Line */}
                <polyline fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pointsString} />

                {/* Hover detection zones (invisible vertical bars) */}
                {points.map((p, i) => (
                    <rect
                        key={i}
                        x={p.x - 10}
                        y={0}
                        width={20}
                        height={height}
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        style={{ cursor: "pointer" }}
                    />
                ))}

                {/* Hover dot */}
                {hoveredPoint && (
                    <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="#f87171" />
                )}
            </svg>
        </div>
    );
}