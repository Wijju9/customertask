/** Current local time as "YYYY-MM-DDTHH:mm:ss" (no time zone suffix). */
export function nowLocalIso(): string {
  const offsetMs = new Date().getTimezoneOffset() * 60_000;
  return new Date(Date.now() - offsetMs).toISOString().slice(0, 19);
}

/** Midnight at the start of today, in local time. */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
