export type GoalStatus = 'Active' | 'Completed' | 'Archived'
export type TaskStatus = 'Todo' | 'InProgress' | 'Done'

export interface Goal {
  id: string
  title: string
  description?: string
  status: GoalStatus
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
}
