import { apiClient, shouldUseLocalFallback } from './client'
import type { LearningTaskResponseDto } from './apiTypes'
import { mapTaskDto } from './mappers'
import { localStoreApi } from './localStore'
import type { LearningTask, TaskInput, TaskStatus } from './types'

const tasksPath = 'LearningTasks'

export async function getTasks(goalId: string): Promise<LearningTask[]> {
  try {
    const { data } = await apiClient.get<LearningTaskResponseDto[]>(`${tasksPath}/goal/${goalId}`)
    return data.map(mapTaskDto)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.getTasks(goalId)
    }
    throw error
  }
}

export async function createTask(goalId: string, input: TaskInput): Promise<LearningTask> {
  try {
    const { data } = await apiClient.post<LearningTaskResponseDto>(`${tasksPath}/${goalId}`, {
      title: input.title,
      description: input.description,
      order: input.order ?? 0,
    })
    return mapTaskDto(data)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.createTask(goalId, input)
    }
    throw error
  }
}

async function getTaskById(taskId: string): Promise<LearningTask> {
  const { data } = await apiClient.get<LearningTaskResponseDto>(`${tasksPath}/${taskId}`)
  return mapTaskDto(data)
}

/**
 * Backend: PATCH api/LearningTasks/{id}/status — 204. Full PUT also exists for title/description/order.
 */
export async function updateTask(taskId: string, patch: Partial<TaskInput>): Promise<LearningTask> {
  try {
    if (patch.status !== undefined) {
      await apiClient.patch(`${tasksPath}/${taskId}/status`, { status: patch.status })
    }
    if (patch.title !== undefined || patch.description !== undefined || patch.order !== undefined) {
      await apiClient.put(`${tasksPath}/${taskId}`, {
        title: patch.title,
        description: patch.description,
        order: patch.order,
      })
    }
    return getTaskById(taskId)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localStoreApi.updateTask(taskId, patch)
    }
    throw error
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<LearningTask> {
  return updateTask(taskId, { status })
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await apiClient.delete(`${tasksPath}/${taskId}`)
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      localStoreApi.deleteTask(taskId)
      return
    }
    throw error
  }
}
