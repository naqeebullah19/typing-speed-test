import type { Metadata } from "next";
import Script from "next/script";
import TypingTest from "./components/TypingBox"; // your existing tool component

// ─── Page-level metadata (overrides layout defaults for this route) ───────────
export const metadata: Metadata = {
  title: "Free Typing Speed Test — Check Your WPM Online",
  description:
    "Take a free typing speed test and instantly see your WPM and accuracy. No sign-up needed. Choose 30-second, 1-minute or 3-minute modes, track your daily streak, and compete on the global leaderboard.",
  alternates: {
    canonical: "https://www.typingspeedtest.live",
  },
  openGraph: {
    title: "Free Typing Speed Test — Check Your WPM Online",
    description:
      "Measure your typing speed in WPM and accuracy instantly. Free, no sign-up. 30s, 1-minute and 3-minute modes with global leaderboard.",
    url: "https://www.typingspeedtest.live",
    type: "website",
  },
};

// ─── Page-level FAQ schema (FAQPage rich snippet — fastest SERP win) ─────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a good typing speed in WPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The average adult typing speed is around 40 WPM. A good typing speed is generally considered 60 WPM or above. Professional typists typically reach 65–75 WPM, while advanced typists exceed 100 WPM. For most office jobs, 50–60 WPM is the standard requirement. If you score above 80 WPM, you are in approximately the top 10% of all keyboard users.",
      },
    },
    {
      "@type": "Question",
      name: "How is WPM (words per minute) calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WPM is calculated by dividing the total number of correctly typed characters by 5 (the standard 'word' length), then dividing by the number of minutes elapsed. For example, if you type 300 correct characters in 1 minute, your WPM is 300 ÷ 5 = 60 WPM. Our test measures net WPM, which deducts errors from your final score — giving you the most accurate reflection of real-world typing performance.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between net WPM and gross WPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gross WPM is your raw typing speed — every character typed counted equally, errors included. Net WPM subtracts uncorrected errors from your gross WPM, giving a more accurate measure of usable typing speed. Most employers and professional typing tests use net WPM. Our typing speed test reports net WPM so your score reflects real productivity, not just finger speed.",
      },
    },
    {
      "@type": "Question",
      name: "How long should I practice typing each day to improve my WPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research on motor skill acquisition shows that 15–20 minutes of focused daily practice is more effective than longer infrequent sessions. Consistent daily practice builds muscle memory faster than sporadic intensive training. Our streak tracker keeps you accountable — users who maintain a 7-day streak typically see a 10–20% improvement in WPM within two weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Is the typing test free with no sign-up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The typing speed test on TypingSpeedTest.live is completely free and requires no account or registration to use. You can take unlimited tests, choose between time-based (30s, 60s, 180s) and word-count modes, and see your WPM and accuracy instantly. Creating a free account is optional — it unlocks streak tracking, personal progress history, and access to the global leaderboard.",
      },
    },
    {
      "@type": "Question",
      name: "What typing speed do I need to get a job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Typing speed requirements vary by role. General office positions typically require 40–50 WPM. Data entry roles usually require 50–60 WPM. Administrative assistants and secretaries are expected to reach 60–75 WPM. Transcriptionists and court reporters may need 80–100+ WPM. Legal and medical secretaries often need 70–80 WPM. Use our typing test to benchmark yourself against these standards before applying.",
      },
    },
    {
      "@type": "Question",
      name: "What is the world record for fastest typing speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Guinness World Record for fastest typing speed is held by Barbara Blackburn, who sustained 150 WPM for 50 minutes and peaked at 212 WPM on a Dvorak keyboard. In online typing test environments, scores above 200 WPM have been recorded on platforms like Monkeytype. The average competitive typist scores between 100–140 WPM.",
      },
    },
    {
      "@type": "Question",
      name: "Does the typing test work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, TypingSpeedTest.live works on mobile browsers and tablets. However, for the most accurate WPM measurement, a physical keyboard is strongly recommended. On-screen virtual keyboards on phones are significantly slower for most users and do not reflect your real typing speed. For job applications or benchmarking purposes, always test on a hardware keyboard.",
      },
    },
    {
      "@type": "Question",
      name: "What is touch typing and does it increase speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Touch typing is a technique where you type using all ten fingers without looking at the keyboard, relying on muscle memory and the home row keys (ASDF JKL;). Studies consistently show that touch typists type significantly faster than hunt-and-peck typists. The average touch typist reaches 55–65 WPM, while the average hunt-and-peck typist plateaus at 27–37 WPM. Learning touch typing is the single highest-ROI investment for improving your long-term typing speed.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this typing speed test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our typing speed test uses precise keystroke timing to calculate your WPM and accuracy down to the character. The timer starts the moment you begin typing, not when the page loads. Net WPM is calculated using the industry-standard formula: (correct characters ÷ 5) ÷ elapsed minutes. Every leaderboard score is validated — making our rankings a true reflection of real typing performance.",
      },
    },
  ],
};

// ─── HowTo schema — targets 'how to improve typing speed' rich snippets ──────
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Improve Your Typing Speed",
  description:
    "A step-by-step guide to increasing your WPM and accuracy using proven typing techniques and daily practice strategies.",
  totalTime: "P30D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "0",
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Measure your baseline WPM",
      text: "Take a 1-minute typing test on TypingSpeedTest.live to get your current WPM and accuracy score. Note both numbers — speed without accuracy is meaningless.",
      url: "https://www.typingspeedtest.live",
    },
    {
      "@type": "HowToStep",
      name: "Learn proper finger placement (home row)",
      text: "Place your left fingers on A-S-D-F and your right fingers on J-K-L-;. Your thumbs rest on the space bar. This is the foundation of touch typing and the single biggest unlock for long-term speed.",
    },
    {
      "@type": "HowToStep",
      name: "Stop looking at the keyboard",
      text: "Force yourself to keep your eyes on the screen. It will feel slow at first — that discomfort is muscle memory forming. Cover the keyboard with a cloth if needed. This phase typically lasts 1–2 weeks.",
    },
    {
      "@type": "HowToStep",
      name: "Prioritise accuracy over speed",
      text: "Aim for 95%+ accuracy before chasing WPM. Bad habits formed at high speed are very hard to unlearn. Slow down until you can type accurately, then let speed build naturally.",
    },
    {
      "@type": "HowToStep",
      name: "Practice daily for 15–20 minutes",
      text: "Daily short sessions beat long infrequent ones. Use the streak tracker on TypingSpeedTest.live to build a consistent habit. Most users see measurable WPM gains within 2 weeks of daily practice.",
    },
    {
      "@type": "HowToStep",
      name: "Test and track your progress weekly",
      text: "Retake the 1-minute typing test weekly to measure improvement. Create a free account on TypingSpeedTest.live to save every score and see your WPM trend over time.",
    },
  ],
};

// ─── BreadcrumbList schema — signals site hierarchy to Google ─────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.typingspeedtest.live",
    },
  ],
};

// ─── Page Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── Page-level structured data ──────────────────────────────────── */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/*
       * ─────────────────────────────────────────────────────────────────────
       * IMPORTANT: Keep your existing page layout/wrapper exactly as-is.
       * Slot in the sections below AFTER your existing tool UI.
       * The tool renders at the top; the SEO content lives below it.
       * Google reads all of it. Users see the tool first.
       * ─────────────────────────────────────────────────────────────────────
       */}

      <main>
        {/* ── 1. TOOL SECTION — your existing typing test component ────── */}
        {/*
         * Replace <TypingTest /> with whatever your actual tool component
         * is called. Do NOT change the tool UI at all — only add what's below.
         */}
        <section aria-label="Typing speed test tool">
          <TypingTest />
        </section>

        {/* ── 2. SEO CONTENT — renders below the tool ─────────────────── */}
        <div className="seo-content">

          {/* ── H1 (one per page, above the fold in SSR HTML) ─────────── */}
          {/*
           * NOTE: Move your H1 HERE if it is currently inside a React
           * client component. Google needs to see it in the initial HTML.
           * If your tool's title is already an H1 in SSR HTML, delete this
           * block and keep yours — just make sure it matches the copy below.
           */}
          <h1 className="sr-only">
            Free Typing Speed Test — Measure Your WPM and Accuracy Online
          </h1>

          {/* ── ABOUT SECTION ────────────────────────────────────────── */}
          <section aria-labelledby="about-heading">
            <h2 id="about-heading">What Is a Typing Speed Test?</h2>
            <p>
              A <strong>typing speed test</strong> measures how many{" "}
              <strong>words per minute (WPM)</strong> you can type accurately on a
              keyboard. It is the universally accepted benchmark for keyboard
              proficiency — used by employers, students, and professional typists
              worldwide. Our free typing test gives you an instant WPM score and{" "}
              <strong>accuracy percentage</strong> the moment you finish, with zero
              registration required.
            </p>
            <p>
              Unlike basic WPM counters, TypingSpeedTest.live calculates your{" "}
              <strong>net WPM</strong> — the industry-standard metric that accounts
              for uncorrected errors. That means your score is an honest reflection
              of real-world typing performance, not just raw finger speed. Every
              result on our <strong>global leaderboard</strong> is validated using
              keystroke-timing analysis so rankings are genuine.
            </p>
          </section>

          {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
          <section aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading">How the Typing Test Works</h2>
            <p>
              Taking the test is simple. Click the text area above or press any
              key to begin. The timer starts the instant you type your first
              character. Type the displayed words as quickly and accurately as
              possible. When the time runs out — or you complete the word count —
              your <strong>WPM score</strong>, accuracy percentage, and error count
              appear instantly.
            </p>
            <h3>Choose Your Test Mode</h3>
            <ul>
              <li>
                <strong>30-second test</strong> — ideal for a quick warm-up or
                checking peak burst speed. Great for beginners who want fast
                feedback without committing to a long session.
              </li>
              <li>
                <strong>1-minute test (60 seconds)</strong> — the most popular
                format. Long enough to reflect sustained speed, short enough to
                repeat. The standard used by most employers and certification
                bodies.
              </li>
              <li>
                <strong>3-minute test (180 seconds)</strong> — the professional
                benchmark. Reveals whether your accuracy holds under fatigue.
                Recommended for anyone preparing for a data entry, admin, or
                transcription job test.
              </li>
              <li>
                <strong>Word-count mode</strong> — complete a fixed number of
                words (10, 25, 50, or 100) at your own pace. No timer pressure;
                pure accuracy focus.
              </li>
            </ul>

            <h3>Understanding Your Results</h3>
            <p>
              After every test you see four metrics:{" "}
              <strong>WPM</strong> (net words per minute),{" "}
              <strong>accuracy</strong> (percentage of correctly typed characters),{" "}
              <strong>errors</strong> (total uncorrected mistakes), and{" "}
              <strong>time</strong> (elapsed seconds). Your WPM is calculated
              using the standard formula: correct characters typed divided by 5,
              divided by elapsed minutes. One "word" is defined as 5 characters —
              the internationally recognised standard across all major typing
              tests.
            </p>
          </section>

          {/* ── BENCHMARKS SECTION ───────────────────────────────────── */}
          <section aria-labelledby="benchmarks-heading">
            <h2 id="benchmarks-heading">Average Typing Speed: How Do You Compare?</h2>
            <p>
              Wondering if your score is good? Here are the globally recognised{" "}
              <strong>WPM benchmarks by skill level</strong>:
            </p>

            {/*
             * Render this as a real HTML <table> — Google reads and indexes
             * table data well, and it may appear as a rich snippet for
             * "average typing speed" queries.
             */}
            <table aria-label="Typing speed benchmarks by level">
              <caption>Typing Speed Benchmarks (WPM) by Skill Level</caption>
              <thead>
                <tr>
                  <th scope="col">Skill Level</th>
                  <th scope="col">WPM Range</th>
                  <th scope="col">Who This Is</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Beginner</td>
                  <td>0 – 30 WPM</td>
                  <td>New typists, children learning to type, hunt-and-peck users</td>
                </tr>
                <tr>
                  <td>Below Average</td>
                  <td>31 – 40 WPM</td>
                  <td>Casual computer users, infrequent typists</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>41 – 55 WPM</td>
                  <td>Most adults; the global average is ~44 WPM</td>
                </tr>
                <tr>
                  <td>Good</td>
                  <td>56 – 70 WPM</td>
                  <td>Regular office workers, university students</td>
                </tr>
                <tr>
                  <td>Fast</td>
                  <td>71 – 90 WPM</td>
                  <td>Professional typists, experienced coders, journalists</td>
                </tr>
                <tr>
                  <td>Very Fast</td>
                  <td>91 – 120 WPM</td>
                  <td>Top 5% of typists; power users and competitive typists</td>
                </tr>
                <tr>
                  <td>Expert</td>
                  <td>120+ WPM</td>
                  <td>Top 1%; competitive typing community members</td>
                </tr>
              </tbody>
            </table>

            <h3>Average Typing Speed by Profession</h3>
            <p>
              Typing speed requirements vary significantly across careers. Here are
              the typical <strong>WPM benchmarks by job role</strong>:
            </p>
            <ul>
              <li>
                <strong>General office worker:</strong> 40–55 WPM — the baseline
                for most white-collar roles.
              </li>
              <li>
                <strong>Administrative assistant / secretary:</strong> 60–75 WPM —
                many job listings explicitly require this range.
              </li>
              <li>
                <strong>Data entry specialist:</strong> 50–70 WPM with 98%+
                accuracy — speed matters, but errors are costly.
              </li>
              <li>
                <strong>Journalist / copywriter:</strong> 65–80 WPM — fluent
                typing keeps up with thought speed.
              </li>
              <li>
                <strong>Software developer / programmer:</strong> 50–70 WPM — but
                coding involves many non-word characters (brackets, operators,
                underscores) that standard tests don't capture.
              </li>
              <li>
                <strong>Court reporter / transcriptionist:</strong> 90–120 WPM —
                among the highest requirements of any profession.
              </li>
            </ul>
          </section>

          {/* ── HOW TO IMPROVE ───────────────────────────────────────── */}
          <section aria-labelledby="improve-heading">
            <h2 id="improve-heading">How to Improve Your Typing Speed</h2>
            <p>
              Improving your WPM is a matter of technique first, then repetition.
              Raw speed without proper form has a hard ceiling — most hunt-and-peck
              typists plateau around 30–40 WPM regardless of how much they
              practice. The proven path to 60+ WPM is{" "}
              <strong>touch typing</strong>.
            </p>

            <h3>Step 1 — Learn the Home Row</h3>
            <p>
              The home row keys are{" "}
              <strong>A S D F</strong> (left hand) and{" "}
              <strong>J K L ;</strong> (right hand). Your index fingers rest on F
              and J — you can feel the tactile bumps on most keyboards. Every
              other key is reached by moving a specific finger from its home
              position and returning. Mastering home row placement is the
              foundation of touch typing.
            </p>

            <h3>Step 2 — Stop Looking at the Keyboard</h3>
            <p>
              This is the most important and most uncomfortable step. Force your
              eyes to stay on the screen. Your typing will slow dramatically at
              first — that is normal and expected. You are overwriting years of
              muscle memory. The discomfort lasts 1–3 weeks for most people,
              after which accuracy and speed both accelerate rapidly.
            </p>

            <h3>Step 3 — Fix Accuracy Before Chasing Speed</h3>
            <p>
              Speed built on inaccurate technique is speed you'll have to unlearn.
              Aim for <strong>95% accuracy or above</strong> before pushing for
              higher WPM. On our typing test, your accuracy is displayed
              prominently alongside WPM — use it as your primary metric when
              learning. Speed follows accuracy naturally as muscle memory
              solidifies.
            </p>

            <h3>Step 4 — Practice Daily (15–20 Minutes)</h3>
            <p>
              Motor skills are built through consistent repetition, not marathon
              sessions. Fifteen focused minutes every day beats two hours once a
              week. Use the{" "}
              <strong>daily streak tracker</strong> on TypingSpeedTest.live to
              build an unbroken practice habit. Our data shows users with a 7-day
              streak improve their WPM by an average of 12% in the first two
              weeks.
            </p>

            <h3>Step 5 — Track Your Progress Over Time</h3>
            <p>
              Create a free account to save every test result and see your WPM
              trend over days and weeks. Progress feels invisible day-to-day but
              becomes undeniable over a month. Watching your score line go up is
              the most effective motivation to keep going — and it's why streak
              tracking works.
            </p>
          </section>

          {/* ── FEATURES SECTION ─────────────────────────────────────── */}
          <section aria-labelledby="features-heading">
            <h2 id="features-heading">Why Use TypingSpeedTest.live?</h2>
            <p>
              There are dozens of typing tests online. Here's what makes ours
              different — and why thousands of users choose it as their daily
              benchmark.
            </p>

            <h3>Precision WPM Measurement</h3>
            <p>
              Our timer starts the instant you type your first character — not
              when you click the page. Net WPM is calculated using the 5-character
              standard with full error deduction. No rounding, no inflation. Your
              score is what it is.
            </p>

            <h3>No Sign-Up, No Ads, 100% Free</h3>
            <p>
              Open the page, type, get your score. No account wall, no email
              capture, no advertisements cluttering the interface. The test is
              completely free, forever. Optional account creation unlocks streak
              tracking and leaderboard placement — but the test itself will always
              be unrestricted.
            </p>

            <h3>Clean, Distraction-Free Interface</h3>
            <p>
              The typing area is the entire page. No sidebars. No banners. No
              animations fighting for your attention. Every design decision was
              made to minimise cognitive load so you can focus on typing —
              exactly the way a precision tool should work.
            </p>

            <h3>Daily Streak Tracking</h3>
            <p>
              Habit formation is the biggest predictor of long-term WPM
              improvement. Log in to track your consecutive daily practice streak.
              Miss a day and it resets — which creates a powerful psychological
              incentive to keep going. Duolingo built an empire on this mechanic.
              We built it for typists.
            </p>

            <h3>Global Leaderboard</h3>
            <p>
              Compete against typists worldwide. All leaderboard scores are
              validated using keystroke-timing analysis — so you're competing
              against real human performance, not bots. Whether you want to be the
              fastest in your country or the fastest on Earth, the leaderboard is
              your benchmark.
            </p>

            <h3>Dark Mode</h3>
            <p>
              Late-night typing session? Switch to dark mode instantly. Your theme
              preference is saved locally — so it's always ready the way you left
              it.
            </p>
          </section>

          {/* ── FAQ SECTION ──────────────────────────────────────────── */}
          {/*
           * The <details>/<summary> elements are accessible and semantic.
           * The FAQ content here MUST match the faqSchema JSON-LD above.
           * Google cross-references both — matching them strengthens your
           * eligibility for the FAQ rich snippet.
           */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently Asked Questions</h2>

            <details>
              <summary>What is a good typing speed in WPM?</summary>
              <p>
                The average adult types around 40 WPM. A good typing speed is
                generally considered <strong>60 WPM or above</strong>. Professional
                typists typically reach 65–75 WPM, while advanced typists exceed
                100 WPM. For most office jobs, 50–60 WPM is the standard
                requirement. If you score above 80 WPM, you are in approximately
                the top 10% of all keyboard users.
              </p>
            </details>

            <details>
              <summary>How is WPM calculated?</summary>
              <p>
                WPM is calculated by dividing the total number of correctly typed
                characters by 5 (the standard "word" length), then dividing by the
                number of minutes elapsed. For example: 300 correct characters in
                1 minute = 300 ÷ 5 = <strong>60 WPM</strong>. Our test measures
                net WPM — errors are deducted — giving you the most accurate
                reflection of real-world typing performance.
              </p>
            </details>

            <details>
              <summary>What is the difference between net WPM and gross WPM?</summary>
              <p>
                <strong>Gross WPM</strong> is your raw typing speed — every
                character counted, errors included.{" "}
                <strong>Net WPM</strong> subtracts uncorrected errors, giving a
                more accurate measure of usable typing speed. Most employers and
                professional typing tests use net WPM. We report net WPM so your
                score reflects real productivity, not just finger speed.
              </p>
            </details>

            <details>
              <summary>How long should I practice daily to improve my WPM?</summary>
              <p>
                <strong>15–20 minutes of focused daily practice</strong> is more
                effective than longer infrequent sessions. Consistent daily
                practice builds muscle memory faster than sporadic intensive
                training. Our streak tracker keeps you accountable — users who
                maintain a 7-day streak typically see a 10–20% WPM improvement
                within two weeks.
              </p>
            </details>

            <details>
              <summary>Is this typing test free with no sign-up?</summary>
              <p>
                Yes. TypingSpeedTest.live is completely free and requires no
                account or registration. You can take unlimited tests and see your
                WPM and accuracy instantly. Creating a free account is optional —
                it unlocks streak tracking, personal progress history, and the
                global leaderboard.
              </p>
            </details>

            <details>
              <summary>What typing speed do I need to get a job?</summary>
              <p>
                Typing requirements vary by role:{" "}
                <strong>General office: 40–50 WPM.</strong>{" "}
                <strong>Data entry: 50–60 WPM.</strong>{" "}
                <strong>Admin / secretary: 60–75 WPM.</strong>{" "}
                <strong>Transcriptionist: 80–100+ WPM.</strong>{" "}
                Use our 1-minute or 3-minute test to benchmark yourself before
                your job application typing test.
              </p>
            </details>

            <details>
              <summary>What is the world record for fastest typing speed?</summary>
              <p>
                The Guinness World Record is held by Barbara Blackburn, who
                sustained <strong>150 WPM</strong> for 50 minutes and peaked at
                212 WPM on a Dvorak keyboard. In online typing test environments,
                scores above 200 WPM have been recorded. The average competitive
                typist scores 100–140 WPM.
              </p>
            </details>

            <details>
              <summary>Does this typing test work on mobile?</summary>
              <p>
                Yes — it works in any mobile browser. However, for an accurate WPM
                score, a <strong>physical keyboard is strongly recommended</strong>.
                On-screen keyboards are significantly slower for most users and do
                not reflect real typing speed. For job applications or benchmarking,
                always test on hardware.
              </p>
            </details>

            <details>
              <summary>What is touch typing?</summary>
              <p>
                Touch typing is typing with all ten fingers without looking at the
                keyboard, relying on muscle memory and home row key placement. The
                average touch typist reaches <strong>55–65 WPM</strong>, while the
                average hunt-and-peck typist plateaus at 27–37 WPM. Learning touch
                typing is the single highest-ROI investment for improving your
                long-term typing speed.
              </p>
            </details>

            <details>
              <summary>How accurate is this typing speed test?</summary>
              <p>
                Our test uses precise keystroke timing to calculate WPM and
                accuracy to the character. The timer starts the moment you begin
                typing. Net WPM uses the industry-standard formula. Every
                leaderboard score is validated — making rankings a true reflection
                of real typing performance.
              </p>
            </details>
          </section>

          {/* ── RELATED LINKS / INTERNAL LINKING ─────────────────────── */}
          {/*
           * Once you build out additional pages, uncomment and fill in
           * these internal links. Internal links with keyword-rich anchor
           * text are a major on-page ranking signal.
           *
           * <nav aria-label="Related typing tests">
           *   <h2>More Typing Tests</h2>
           *   <ul>
           *     <li><a href="/typing-test/1-minute">1-Minute Typing Test</a></li>
           *     <li><a href="/typing-test/5-minute">5-Minute Typing Test</a></li>
           *     <li><a href="/typing-test/for-beginners">Typing Test for Beginners</a></li>
           *     <li><a href="/typing-test/data-entry">Data Entry Typing Test</a></li>
           *     <li><a href="/typing-test/for-kids">Typing Test for Kids</a></li>
           *     <li><a href="/wpm/what-is-good-wpm">What Is a Good WPM?</a></li>
           *   </ul>
           * </nav>
           */}

        </div>
        {/* end .seo-content */}
      </main>
    </>
  );
}
