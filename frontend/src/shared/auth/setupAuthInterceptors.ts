import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { apiClient } from '../api/client'
import { refresh } from '../api/auth'
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

type PendingRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

const authRouteMatchers = ['/Auth/login', '/Auth/refresh', '/Auth/register']

function isAuthRoute(url?: string): boolean {
  if (!url) return false
  return authRouteMatchers.some((route) => url.includes(route))
}

export function setupAuthInterceptors(onAuthFailure: () => void): () => void {
  let isRefreshing = false
  let pendingRequests: PendingRequest[] = []

  const processPendingRequests = (error: unknown, token: string | null) => {
    pendingRequests.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token)
      } else {
        reject(error)
      }
    })
    pendingRequests = []
  }

  const requestInterceptor = apiClient.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const responseInterceptor = apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
        return Promise.reject(error)
      }

      const requestConfig = error.config as RetryableRequestConfig | undefined
      if (!requestConfig || requestConfig._retry || isAuthRoute(requestConfig.url)) {
        return Promise.reject(error)
      }

      requestConfig._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token: string) => {
              requestConfig.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(requestConfig))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      try {
        const refreshResult = await refresh()
        const newAccessToken = refreshResult.accessToken
        if (!newAccessToken) {
          throw new AxiosError('Missing access token in refresh response')
        }

        setAccessToken(newAccessToken)
        processPendingRequests(null, newAccessToken)

        requestConfig.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(requestConfig)
      } catch (refreshError) {
        clearAccessToken()
        processPendingRequests(refreshError, null)
        onAuthFailure()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )

  return () => {
    apiClient.interceptors.request.eject(requestInterceptor)
    apiClient.interceptors.response.eject(responseInterceptor)
  }
}
