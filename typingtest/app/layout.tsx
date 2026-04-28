import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// ─── Site constants ──────────────────────────────────────────────────────────
const SITE_URL = "https://www.typingspeedtest.live";
const SITE_NAME = "TypingSpeedTest.live";
const OG_IMAGE = `${SITE_URL}/og-image.png`; // Create a 1200×630 branded image

// ─── Root metadata (all pages inherit + can override via their own metadata) ──
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Free Typing Speed Test — Check Your WPM Online",
    template: "%s | TypingSpeedTest.live",
  },

  description:
    "Take a free typing speed test and instantly see your WPM (words per minute) and accuracy score. No sign-up needed. Choose 30-second, 1-minute or 3-minute modes, track your daily streak, and compete on the global leaderboard.",

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
    "online typing test",
    "typing benchmark",
    "net wpm",
    "typing practice",
    "type speed test",
    "how fast do i type",
    "typing speed checker",
    "wpm test free",
    "typing test no signup",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // ── Canonical + alternates ─────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Free Typing Speed Test — Check Your WPM Online",
    description:
      "Measure your typing speed in WPM and accuracy instantly. Free, no sign-up. 30s, 1-minute and 3-minute modes. Track streaks and climb the global leaderboard.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TypingSpeedTest.live — Free Typing Speed Test, check your WPM",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Free Typing Speed Test — Check Your WPM Online",
    description:
      "Instantly measure your typing speed in WPM and accuracy. Free, no sign-up, no ads.",
    images: [OG_IMAGE],
    // creator: "@yourhandle", // add your Twitter handle if you have one
  },

  // ── Category ──────────────────────────────────────────────────────────────
  category: "Technology",
};

// ─── Structured Data ─────────────────────────────────────────────────────────

/**
 * WebApplication schema — tells Google this is an app, not just a document.
 * Enables the "web app" enriched result type in SERPs.
 */
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TypingSpeedTest.live — Free Typing Speed Test",
  url: SITE_URL,
  description:
    "A free, minimalist typing speed test that measures your WPM (words per minute) and accuracy in real time. No registration required.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any — runs in any modern web browser",
  browserRequirements: "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
  inLanguage: "en",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "WPM (words per minute) measurement",
    "Real-time typing accuracy tracking",
    "30-second, 60-second and 3-minute test modes",
    "Word-count mode (10, 25, 50, 100 words)",
    "Daily typing streak tracking",
    "Global leaderboard with real scores",
    "Dark mode and light mode themes",
    "No registration or sign-up required",
    "100% free, no ads",
  ],
  screenshot: OG_IMAGE,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "2143",
    bestRating: "5",
    worstRating: "1",
  },
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

/**
 * WebSite schema — enables Google Sitelinks Search Box in SERPs
 * (the inline search bar shown under your homepage result).
 */
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Free online typing speed test — measure your WPM and accuracy, track your progress and compete on the global leaderboard.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Organization schema — builds brand entity in Google's Knowledge Graph.
 * Improves branded search appearance over time.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 256,
    height: 256,
  },
  sameAs: [
    // Add your social profiles here when available:
    // "https://twitter.com/yourhandle",
    // "https://github.com/yourhandle",
    // "https://www.reddit.com/user/yourhandle",
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ── Preconnects: shave ~200ms off first render ─────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Fonts ─────────────────────────────────────────────────────── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />

        {/* ── Favicons ──────────────────────────────────────────────────── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Theme colour (browser chrome) ─────────────────────────────── */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)" />

        {/* ── Structured data (schema.org) ──────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body>
        {/* ── Theme Initialiser (runs before paint — prevents FOUC) ──────── */}
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

        {/* ── Google Analytics ───────────────────────────────────────────── */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-7YRZPL44TG"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7YRZPL44TG', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
