/**
 * Shapes returned by ASP.NET Core JSON (camelCase) — mirrors LearningPlanner.Api.DTOs.
 */
export interface LearningGoalResponseDto {
  id: string
  title: string
  description?: string | null
  status: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface LearningTaskResponseDto {
  id: string
  goalId: string
  title: string
  description?: string | null
  status: string
  order: number
  createdAt: string
}
