import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://typingspeedtest.live"),
  title: "Free Typing Speed Test — Check Your WPM Online",
  description: "Take a free typing speed test and instantly see your WPM (words per minute) and accuracy score. No sign-up needed. Choose 15-second, 30-second, 1-minute or 2-minute modes, track your daily streak, and compete on the global leaderboard.",
  keywords: [
    "typing speed test",
    "wpm test",
    "free typing test",
    "typing test online",
    "words per minute test",
    "keyboard speed test",
    "typing accuracy test",
    "touch typing test",
    "wpm checker",
    "fast typing"
  ],
  authors: [{ name: "Typing Speed Test" }],
  creator: "Typing Speed Test",
  alternates: {
    canonical: "https://typingspeedtest.live",
  },
  openGraph: {
    title: "Free Typing Speed Test — Check Your WPM Online",
    description: "Measure your typing speed in WPM and accuracy instantly. Free, no sign-up. 15s, 30s, 60s, and 120s modes with a global leaderboard.",
    url: "https://typingspeedtest.live",
    siteName: "Typing Speed Test",
    images: [
      {
        url: "/opengraph-image.png", // Next.js will automatically find this in your app/ or public/ folder
        width: 1200,
        height: 630,
        alt: "Typing Speed Test - Measure your WPM instantly",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // This is the magic line that makes the image massive on Twitter/Discord
    title: "Free Typing Speed Test — Check Your WPM Online",
    description: "Measure your typing speed in WPM and accuracy instantly. Free, no sign-up. Challenge yourself and climb the leaderboard.",
    images: ["/opengraph-image.png"],
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500;600;700&display=swap"
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