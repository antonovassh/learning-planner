import { apiClient, shouldUseLocalFallback } from './client'
import { localStoreApi } from './localStore'
import type { Goal, GoalInput } from './types'

export async function getGoals(): Promise<Goal[]> {
  try {
    const { data } = await apiClient.get<Goal[]>('/goals')
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.getGoals()
    }
    throw error
  }
}

export async function createGoal(input: GoalInput): Promise<Goal> {
  try {
    const { data } = await apiClient.post<Goal>('/goals', input)
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.createGoal(input)
    }
    throw error
  }
}

export async function updateGoal(goalId: string, patch: Partial<GoalInput>): Promise<Goal> {
  try {
    const { data } = await apiClient.patch<Goal>(`/goals/${goalId}`, patch)
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.updateGoal(goalId, patch)
    }
    throw error
  }
}
