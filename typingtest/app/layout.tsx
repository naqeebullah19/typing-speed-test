import type { Metadata } from "next";
import Script from "next/script"; // 1. Import the Next.js Script component
import "./globals.css";

export const metadata: Metadata = {
  title: "Typing Speed Test — Typing Speed Test",
  description: "A minimal, precision typing speed test. Measure your WPM and accuracy with a clean, distraction-free experience.",
  keywords: [
    "typing speed test",
    "typing test online",
    "online typing test",
    "typing test",
    "typing",
    "free typing test",
    "WPM",
    "words per minute",
    "typing speed",
    "accuracy"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* 2. Replaced <script> with <Script> */}
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`
            try {
              const saved = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = saved || (prefersDark ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}