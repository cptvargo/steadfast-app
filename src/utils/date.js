/**
 * Returns a YYYY-MM-DD string in the user's LOCAL timezone.
 * Never use toISOString() for date keys — that's UTC and will
 * silently shift the date for anyone outside the UTC+0 zone.
 */
export function localDateStr(daysAgo = 0) {
  const d = new Date();
  if (daysAgo) d.setDate(d.getDate() - daysAgo);
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
