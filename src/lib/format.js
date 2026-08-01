/**
 * Formatting helpers.
 *
 * All of these delegate to Intl rather than hand-rolling day/month tables, so
 * they stay correct across locales and time zones. Stay dates are stored as
 * naive timestamps (no zone), so they are read as calendar dates and must not
 * be shifted into the viewer's local zone.
 */

// en-US renders USD as "$1,200"; en-GB would render the same amount as
// "US$1,200", which reads as a foreign currency inside a US-priced product.
const LOCALE = "en-US";

const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyWithCents = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat(LOCALE, { notation: "compact" });

const dayMonth = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
});

const fullDate = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateAndTime = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

export function formatCurrency(value, { cents = false } = {}) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "–";
  return cents ? currencyWithCents.format(amount) : currency.format(amount);
}

export function formatCompact(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? compactNumber.format(amount) : "–";
}

export function formatPercent(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? `${Math.round(amount)}%` : "–";
}

/** "12 Mar", for dense contexts like chart axes and table cells. */
export function formatShortDate(value) {
  const date = toDate(value);
  return date ? dayMonth.format(date) : "–";
}

/** "12 Mar 2026" */
export function formatDate(value) {
  const date = toDate(value);
  return date ? fullDate.format(date) : "–";
}

/** "Thu, 12 Mar 2026, 14:30", for audit-style timestamps. */
export function formatDateTime(value) {
  const date = toDate(value);
  return date ? dateAndTime.format(date) : "–";
}

/** "in 3 days" / "2 days ago", falling back to an absolute date past a week. */
export function formatRelativeDate(value) {
  const date = toDate(value);
  if (!date) return "–";

  const days = differenceInCalendarDays(date, new Date());
  if (Math.abs(days) > 7) return fullDate.format(date);
  return relative.format(days, "day");
}

/** Whole calendar days between two dates, ignoring clock time. */
export function differenceInCalendarDays(later, earlier) {
  const a = startOfDay(later);
  const b = startOfDay(earlier);
  return Math.round((a - b) / 86_400_000);
}

export function startOfDay(value) {
  const date = toDate(value);
  if (!date) return null;
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** `YYYY-MM-DD` in local time, the shape the dashboard RPCs expect. */
export function toISODate(value) {
  const date = toDate(value) ?? new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function subtractDays(value, days) {
  const date = new Date(toDate(value) ?? Date.now());
  date.setDate(date.getDate() - days);
  return date;
}

export function isToday(value) {
  const date = toDate(value);
  return date ? differenceInCalendarDays(date, new Date()) === 0 : false;
}

export function pluralise(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function initialsFrom(nameOrEmail = "") {
  const source = String(nameOrEmail).split("@")[0].trim();
  if (!source) return "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

function toDate(value) {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
