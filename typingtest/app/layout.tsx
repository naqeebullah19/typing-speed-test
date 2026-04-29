import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Typing Speed Test — Check Your WPM Online",
  description: "Take a free typing speed test and instantly see your WPM (words per minute) and accuracy score. No sign-up needed. Choose 30-second, 1-minute or 3-minute modes, track your daily streak, and compete on the global leaderboard.",
  keywords: [
    "typing speed test",
    "wpm test",
    "free typing test",
    "typing test online",
    "words per minute test",
    "keyboard speed test",
    "typing accuracy test",
    "touch typing test",
    "wpm checker"
  ],
  openGraph: {
    title: "Free Typing Speed Test — Check Your WPM Online",
    description: "Measure your typing speed in WPM and accuracy instantly. Free, no sign-up. 30s, 1-minute and 3-minute modes with global leaderboard.",
    url: "https://typingspeedtest.live",
    siteName: "Typing Speed Test",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
        {/* Theme Initializer */}
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

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-7YRZPL44TG`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7YRZPL44TG');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}