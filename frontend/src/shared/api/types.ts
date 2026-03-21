export type GoalStatus = 'Active' | 'Completed' | 'Archived'
export type TaskStatus = 'Todo' | 'InProgress' | 'Done'

export interface Goal {
  id: string
  title: string
  description?: string
  status: GoalStatus
  /** 0–100 from API (completed tasks ratio) */
  progress?: number
  createdAt: string
  updatedAt: string
}

export interface LearningTask {
  id: string
  goalId: string
  title: string
  description?: string
  status: TaskStatus
  order: number
  createdAt: string
}

export interface GoalInput {
  title: string
  description?: string
  status?: GoalStatus
}

export interface TaskInput {
  title: string
  description?: string
  status?: TaskStatus
  /** Backend requires order on create; default 0 in API layer */
  order?: number
}
