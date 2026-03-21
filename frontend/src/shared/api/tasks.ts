import { apiClient, shouldUseLocalFallback } from './client'
import { localStoreApi } from './localStore'
import type { LearningTask, TaskInput } from './types'

export async function getTasks(goalId: string): Promise<LearningTask[]> {
  try {
    const { data } = await apiClient.get<LearningTask[]>(`/goals/${goalId}/tasks`)
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.getTasks(goalId)
    }
    throw error
  }
}

export async function createTask(goalId: string, input: TaskInput): Promise<LearningTask> {
  try {
    const { data } = await apiClient.post<LearningTask>(`/goals/${goalId}/tasks`, input)
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.createTask(goalId, input)
    }
    throw error
  }
}

export async function updateTask(taskId: string, patch: Partial<TaskInput>): Promise<LearningTask> {
  try {
    const { data } = await apiClient.patch<LearningTask>(`/tasks/${taskId}`, patch)
    return data
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.updateTask(taskId, patch)
    }
    throw error
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await apiClient.delete(`/tasks/${taskId}`)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      localStoreApi.deleteTask(taskId)
      return
    }
    throw error
  }
}
