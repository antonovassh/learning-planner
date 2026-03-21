import type { LearningGoalResponseDto, LearningTaskResponseDto } from './apiTypes'
import type { Goal, GoalStatus, LearningTask, TaskStatus } from './types'

function asGoalStatus(value: string): GoalStatus {
  if (value === 'Active' || value === 'Completed' || value === 'Archived') {
    return value
  }
  return 'Active'
}

function asTaskStatus(value: string): TaskStatus {
  if (value === 'Todo' || value === 'InProgress' || value === 'Done') {
    return value
  }
  return 'Todo'
}

export function mapGoalDto(dto: LearningGoalResponseDto): Goal {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    status: asGoalStatus(dto.status),
    progress: dto.progress,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function mapTaskDto(dto: LearningTaskResponseDto): LearningTask {
  return {
    id: dto.id,
    goalId: dto.goalId,
    title: dto.title,
    description: dto.description ?? undefined,
    status: asTaskStatus(dto.status),
    order: dto.order,
    createdAt: dto.createdAt,
  }
}
