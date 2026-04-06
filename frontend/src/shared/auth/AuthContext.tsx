import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest, logout as logoutRequest, refresh } from '../api/auth'
import { clearAccessToken, setAccessToken } from './tokenStore'
import { setupAuthInterceptors } from './setupAuthInterceptors'

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleAuthFailure = useCallback(() => {
    clearAccessToken()
    setIsAuthenticated(false)
    queryClient.clear()
    navigate('/login', { replace: true })
  }, [navigate, queryClient])

  useEffect(() => {
    const teardown = setupAuthInterceptors(handleAuthFailure)
    return teardown
  }, [handleAuthFailure])

  useEffect(() => {
    let mounted = true

    const bootstrapSession = async () => {
      try {
        const result = await refresh()
        if (!mounted) return

        if (!result.success || !result.accessToken) {
          handleAuthFailure()
          return
        }

        setAccessToken(result.accessToken)
        setIsAuthenticated(true)
      } catch {
        if (mounted) {
          clearAccessToken()
          setIsAuthenticated(false)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    bootstrapSession()
    return () => {
      mounted = false
    }
  }, [handleAuthFailure])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginRequest({ email, password })
      if (!result.success || !result.accessToken) {
        throw new Error(result.message ?? 'Login failed')
      }
      setAccessToken(result.accessToken)
      setIsAuthenticated(true)
      navigate('/goals', { replace: true })
    },
    [navigate],
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      handleAuthFailure()
    }
  }, [handleAuthFailure])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return value
}
