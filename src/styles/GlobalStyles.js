import { createGlobalStyle } from "styled-components";

/**
 * Design tokens for Alpenglow.
 *
 * Three layers:
 *   1. Brand palette   (--pine-*, --ember-*, --sand-*): one source of truth
 *   2. App semantics   (--surface, --text, --accent…): the staff dashboard,
 *      switched by data-theme on <html>
 *   3. Site semantics  (--site-*): the public marketing site, defined in
 *      SiteStyles and deliberately independent of light/dark
 *
 * The palette is named after alpenglow: the deep pine of the valley at dusk
 * and the ember light that lands on the peaks above it.
 */
const GlobalStyles = createGlobalStyle`
  :root {
    /* ---- brand palette ------------------------------------------------ */
    --pine-50:  #f0f5f2;
    --pine-100: #dbe8e0;
    --pine-200: #b8d1c3;
    --pine-300: #8db29e;
    --pine-400: #5f8d76;
    --pine-500: #3f6f57;
    --pine-600: #2d5843;
    --pine-700: #244636;
    --pine-800: #1c352a;
    --pine-900: #12241a;
    --pine-950: #0a160f;

    --ember-50:  #fdf5ee;
    --ember-100: #fae4d2;
    --ember-200: #f4c69f;
    --ember-300: #eda36c;
    --ember-400: #e8834c;
    --ember-500: #dd6632;
    --ember-600: #c45026;
    --ember-700: #a23c20;
    --ember-800: #7d301d;
    --ember-900: #5c2517;

    --sand-50:  #fbf9f5;
    --sand-100: #f5f0e7;
    --sand-200: #eae1d2;
    --sand-300: #d9cbb5;
    --sand-400: #bfaa89;
    --sand-500: #9f8b6a;

    /* ---- typography --------------------------------------------------- */
    --font-display: Fraunces, Georgia, "Times New Roman", serif;
    --font-body: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      Roboto, sans-serif;

    /* ---- spacing (4px base) ------------------------------------------- */
    --space-1: 0.4rem;
    --space-2: 0.8rem;
    --space-3: 1.2rem;
    --space-4: 1.6rem;
    --space-5: 2.0rem;
    --space-6: 2.4rem;
    --space-8: 3.2rem;
    --space-10: 4.0rem;
    --space-12: 4.8rem;
    --space-16: 6.4rem;
    --space-20: 8.0rem;
    --space-24: 9.6rem;

    /* ---- type scale ---------------------------------------------------- */
    --text-xs:   1.1rem;
    --text-sm:   1.3rem;
    --text-base: 1.4rem;
    --text-md:   1.6rem;
    --text-lg:   1.8rem;
    --text-xl:   2.2rem;
    --text-2xl:  2.8rem;
    --text-3xl:  3.6rem;
    --text-4xl:  4.8rem;
    --text-5xl:  6.4rem;
    --text-6xl:  8.4rem;

    /* ---- radii + motion ------------------------------------------------ */
    --radius-sm: 0.6rem;
    --radius-md: 0.9rem;
    --radius-lg: 1.4rem;
    --radius-xl: 2.4rem;
    --radius-full: 999px;

    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --duration: 180ms;
    --duration-slow: 600ms;

    --sidebar-width: 24rem;
    --topbar-height: 6.4rem;
    --content-max: 140rem;
    --site-max: 124rem;
  }

  /* ---- dashboard: light theme ---------------------------------------- */
  :root,
  :root[data-theme="light"] {
    color-scheme: light;

    --canvas:        #f2f4f2;
    --surface:       #ffffff;
    --surface-sunken: #f8faf8;
    --surface-hover: #f0f4f1;
    --surface-inset: #f7faf8;

    --border:        #e3e8e4;
    --border-strong: #c9d2cb;

    --text:          #12241a;
    --text-secondary: #46584d;
    /* Was #8b9a90, which measured 2.7:1 on the canvas. */
    --text-muted:    #647268;
    --text-inverted: #ffffff;

    --accent:        var(--pine-600);
    --accent-hover:  var(--pine-700);
    --accent-soft:   var(--pine-50);
    --accent-soft-text: var(--pine-700);
    --accent-ring:   rgba(45, 88, 67, 0.3);
    /* What to write on top of --accent and --danger. Hard-coded white was
       unreadable in dark mode, where both fills are light. */
    --accent-contrast: #ffffff;
    --danger-contrast: #ffffff;

    --success-soft: #dcf3e3;
    --success-text: #1d6b3c;
    --warning-soft: var(--ember-100);
    --warning-text: var(--ember-700);
    --danger-soft:  #fde4e1;
    --danger-text:  #b03024;
    --danger:       #c4372a;
    --danger-hover: #9e2b20;
    --info-soft:    #ddeef2;
    --info-text:    #1f6072;
    --neutral-soft: #eef1ef;
    --neutral-text: #46584d;

    --shadow-sm: 0 1px 2px rgba(18, 36, 26, 0.06);
    --shadow-md: 0 2px 8px rgba(18, 36, 26, 0.08);
    --shadow-lg: 0 12px 32px -8px rgba(18, 36, 26, 0.18);
    --shadow-xl: 0 24px 56px -12px rgba(18, 36, 26, 0.26);

    --scrim: rgba(10, 22, 15, 0.45);
    --skeleton: linear-gradient(90deg, #eef2ef 25%, #e0e7e2 37%, #eef2ef 63%);
  }

  /* ---- dashboard: dark theme ------------------------------------------
     Surfaces keep a green cast rather than going neutral grey, so the two
     themes read as the same product. */
  :root[data-theme="dark"] {
    color-scheme: dark;

    --canvas:        #0a1310;
    --surface:       #11201a;
    --surface-sunken: #0d1a15;
    --surface-hover: #1a2d24;
    --surface-inset: #0d1a15;

    --border:        #223429;
    --border-strong: #33493c;

    --text:          #e8f0ea;
    --text-secondary: #a4b8ac;
    /* Was #6d8378, which measured 3.6:1 on a hovered surface. */
    --text-muted:    #88a094;
    --text-inverted: #0a1310;

    --accent:        var(--pine-300);
    --accent-hover:  var(--pine-200);
    --accent-soft:   rgba(141, 178, 158, 0.16);
    --accent-soft-text: var(--pine-200);
    --accent-ring:   rgba(141, 178, 158, 0.42);
    --accent-contrast: var(--pine-950);
    --danger-contrast: #0a1310;

    --success-soft: rgba(34, 197, 94, 0.16);
    --success-text: #6ee7a8;
    --warning-soft: rgba(232, 131, 76, 0.18);
    --warning-text: var(--ember-300);
    --danger-soft:  rgba(239, 68, 68, 0.16);
    --danger-text:  #fca5a5;
    --danger:       #ef4444;
    --danger-hover: #dc2626;
    --info-soft:    rgba(56, 189, 248, 0.16);
    --info-text:    #7dd3fc;
    --neutral-soft: rgba(164, 184, 172, 0.14);
    --neutral-text: #a4b8ac;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 2px 10px rgba(0, 0, 0, 0.45);
    --shadow-lg: 0 12px 32px -8px rgba(0, 0, 0, 0.6);
    --shadow-xl: 0 24px 56px -12px rgba(0, 0, 0, 0.7);

    --scrim: rgba(4, 10, 7, 0.7);
    --skeleton: linear-gradient(90deg, #16261e 25%, #1f3329 37%, #16261e 63%);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* 62.5% makes 1rem === 10px, so the rem-based token scale reads in px. */
  html {
    font-size: 62.5%;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.55;
    color: var(--text);
    background-color: var(--canvas);
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    transition: background-color var(--duration) var(--ease),
      color var(--duration) var(--ease);
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--text);
    overflow-wrap: break-word;
  }

  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  img, svg, video {
    display: block;
    max-width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  :disabled {
    cursor: not-allowed;
  }

  /* One focus treatment everywhere, keyboard-only so pointer users don't see
     rings on every click. */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  ::selection {
    background-color: var(--ember-200);
    color: var(--pine-900);
  }

  /* Available to screen readers, invisible on screen, used for table headers
     whose column holds only icon buttons. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  /* Scrollbars: visible enough to grab, quiet enough to ignore. */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) transparent;
  }
  *::-webkit-scrollbar { width: 10px; height: 10px; }
  *::-webkit-scrollbar-track { background: transparent; }
  *::-webkit-scrollbar-thumb {
    background-color: var(--border-strong);
    border-radius: var(--radius-full);
    border: 3px solid transparent;
    background-clip: content-box;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* react-toastify, restyled onto the token system. */
  .Toastify__toast {
    border-radius: var(--radius-md);
    background-color: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    font-size: var(--text-base);
    font-family: var(--font-body);
    padding: var(--space-3);
  }
  .Toastify__toast-body { font-family: inherit; }
  .Toastify__close-button { color: var(--text-muted); opacity: 1; }
  .Toastify__progress-bar--success { background: var(--success-text); }
  .Toastify__progress-bar--error   { background: var(--danger); }
  .Toastify__progress-bar--info    { background: var(--accent); }
`;

export default GlobalStyles;
