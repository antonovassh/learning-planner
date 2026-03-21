/** English UI: fixed locale so dates don't follow OS language (e.g. Russian Windows). */
const APP_LOCALE = 'en-US'

export function formatAppDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(APP_LOCALE, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}
