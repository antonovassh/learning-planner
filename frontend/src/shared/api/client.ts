import axios from 'axios'

/** Matches backend/LearningPlanner/Properties/launchSettings.json (profile "http") */
const fallbackBaseUrl = 'http://localhost:5189/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl,
  timeout: 4000,
})

export function shouldUseLocalFallback(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  if (!error.response) {
    return true
  }

  // Wrong routes should surface as errors; only server/network issues use local demo data.
  return error.response.status >= 500
}
