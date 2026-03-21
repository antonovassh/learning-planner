import axios from 'axios'

/** Matches backend/LearningPlanner/Properties/launchSettings.json (profile "http") */
const fallbackBaseUrl = 'http://localhost:5189/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl,
  timeout: 4000,
})

let warnedAboutLocalFallback = false

export function shouldUseLocalFallback(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  if (!error.response) {
    if (import.meta.env.DEV && !warnedAboutLocalFallback) {
      warnedAboutLocalFallback = true
      console.warn(
        '[LearningPlanner] API unreachable (no response). Using local demo data. ' +
          'Typical causes: API not running, wrong VITE_API_BASE_URL, CORS, or HTTPS redirect. ' +
          `Trying: ${import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl}`,
        error.message,
      )
    }
    return true
  }

  // Wrong routes should surface as errors; only server/network issues use local demo data.
  if (error.response.status >= 500) {
    if (import.meta.env.DEV && !warnedAboutLocalFallback) {
      warnedAboutLocalFallback = true
      console.warn(
        '[LearningPlanner] API server error — using local demo data.',
        error.response.status,
      )
    }
    return true
  }

  return false
}
