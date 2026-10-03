/** Date and timezone helpers — a letter's delivery time is always local to its timezone. */

export function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

/** Every IANA zone the runtime knows about, browser time zone first. */
export function timeZoneOptions() {
  const current = localTimeZone();
  const zones =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [current];
  return [...new Set([current, ...zones])].map((zone) => ({
    value: zone,
    label: zone.replace(/_/g, " "),
  }));
}

/** Today as seen from `timeZone` — the earliest date a delivery can be booked for. */
export function todayISOIn(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts;
}

/**
 * Convert a wall-clock date + time in `timeZone` into a real instant.
 * Two passes: read the zone's rendering of the naive UTC guess, then correct.
 */
export function zonedTimeToDate(dateString, timeString, timeZone) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute);

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(new Date(naiveUtc))
      .map((part) => [part.type, part.value]),
  );

  const renderedUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return new Date(naiveUtc - (renderedUtc - naiveUtc));
}

export function formatDay(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatTime(timeString) {
  const [hour, minute] = timeString.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
    new Date(2000, 0, 1, hour, minute),
  );
}

/** Human summary used on the seal confirmation: "Tue, 4 March 2025 at 9:00 AM (Europe/Oslo)". */
export function describeDelivery({ date, time, timezone }) {
  return `${formatDay(date)} at ${formatTime(time)} (${timezone.replace(/_/g, " ")})`;
}

export function formatOpenedOn(date) {
  if (!date) return "";
  return `opened ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
}

/** First line / first ~140 characters, for wall card previews. */
export function excerpt(text, limit = 140) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
}