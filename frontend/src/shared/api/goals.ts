import { apiClient, shouldUseLocalFallback } from './client'
import type { LearningGoalResponseDto } from './apiTypes'
import { mapGoalDto } from './mappers'
import { localStoreApi } from './localStore'
import type { Goal, GoalInput } from './types'

const goalsPath = 'LearningGoals'

export async function getGoals(): Promise<Goal[]> {
  try {
    const { data } = await apiClient.get<LearningGoalResponseDto[]>(goalsPath)
    return data.map(mapGoalDto)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.getGoals()
    }
    throw error
  }
}

export async function getGoalById(goalId: string): Promise<Goal> {
  try {
    const { data } = await apiClient.get<LearningGoalResponseDto>(`${goalsPath}/${goalId}`)
    return mapGoalDto(data)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      const goals = localStoreApi.getGoals()
      const found = goals.find((g) => g.id === goalId)
      if (!found) throw error
      return found
    }
    throw error
  }
}

export async function createGoal(input: GoalInput): Promise<Goal> {
  try {
    const { data } = await apiClient.post<LearningGoalResponseDto>(goalsPath, {
      title: input.title,
      description: input.description,
    })
    return mapGoalDto(data)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.createGoal(input)
    }
    throw error
  }
}

/**
 * Backend: PUT api/LearningGoals/{id} with optional title, description, status — 204 No Content.
 */
export async function updateGoal(goalId: string, patch: Partial<GoalInput>): Promise<Goal> {
  try {
    await apiClient.put(`${goalsPath}/${goalId}`, {
      title: patch.title,
      description: patch.description,
      status: patch.status,
    })
    return getGoalById(goalId)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.updateGoal(goalId, patch)
    }
    throw error
  }
}
