import axios from 'axios'

const fallbackBaseUrl = 'http://localhost:5000/api'

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

  return error.response.status >= 500 || error.response.status === 404
}
