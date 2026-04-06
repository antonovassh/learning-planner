import { apiClient } from './client'

interface AuthResponse {
  success: boolean
  message?: string
  accessToken?: string
  userId?: string
  email?: string
}

interface LoginRequest {
  email: string
  password: string
}

interface LogoutResponse {
  success: boolean
  message?: string
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('Auth/login', payload)
  return data
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('Auth/refresh', {})
  return data
}

export async function logout(): Promise<LogoutResponse> {
  const { data } = await apiClient.post<LogoutResponse>('Auth/logout', {})
  return data
}
