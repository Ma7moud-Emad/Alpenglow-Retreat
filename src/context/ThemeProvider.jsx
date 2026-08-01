import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./contexts";

const STORAGE_KEY = "hotel:theme";
const MODES = ["light", "dark", "system"];

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

/**
 * Three-way theme control: light, dark, or follow the OS.
 *
 * "system" is the default and stays live: changing the OS appearance while
 * the dashboard is open re-themes it without a reload.
 */
export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolved === "dark" ? "#0b1120" : "#f1f5f9");
  }, [resolved]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Private browsing with storage disabled: the theme just won't persist.
    }
  }, [mode]);

  const toggle = useCallback(
    () => setMode(resolved === "dark" ? "light" : "dark"),
    [resolved]
  );

  const value = useMemo(
    () => ({ mode, resolved, isDark: resolved === "dark", setMode, toggle }),
    [mode, resolved, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
