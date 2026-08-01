/**
 * Recharts writes colours as SVG presentation attributes, where `var(--token)`
 * is not resolved. So the chart palette is mirrored here as literal values and
 * picked by theme.
 */
export function chartTheme(isDark) {
  return {
    grid: isDark ? "#24304a" : "#e2e8f0",
    axis: isDark ? "#6b7a95" : "#94a3b8",
    tooltipBackground: isDark ? "#131c31" : "#ffffff",
    tooltipBorder: isDark ? "#24304a" : "#e2e8f0",
    text: isDark ? "#e8edf7" : "#0f172a",
    total: {
      stroke: isDark ? "#818cf8" : "#4f46e5",
      fill: isDark ? "#4f46e5" : "#a5b4fc",
    },
    extras: {
      stroke: isDark ? "#34d399" : "#059669",
      fill: isDark ? "#059669" : "#6ee7b7",
    },
    // Sequential ramp: stay length reads as an ordered scale, not categories.
    duration: isDark
      ? ["#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#fb7185"]
      : ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"],
  };
}
