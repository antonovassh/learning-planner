import type { Goal, GoalInput, LearningTask, TaskInput } from './types'

const goalsKey = 'lp-goals'
const tasksKey = 'lp-tasks'

const seedGoalId = 'seed-goal-1'
const seedGoals: Goal[] = [
  {
    id: seedGoalId,
    title: 'Learn React basics',
    description: 'Build first CRUD app with MUI',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const seedTasks: LearningTask[] = [
  {
    id: 'seed-task-1',
    goalId: seedGoalId,
    title: 'Set up router and providers',
    status: 'InProgress',
    order: 1,
    createdAt: new Date().toISOString(),
  },
]

function readJson<T>(key: string, initialValue: T): T {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export const localStoreApi = {
  getGoals(): Goal[] {
    return readJson(goalsKey, seedGoals)
  },

  createGoal(input: GoalInput): Goal {
    const now = new Date().toISOString()
    const goals = localStoreApi.getGoals()
    const created: Goal = {
      id: newId('goal'),
      title: input.title,
      description: input.description,
      status: input.status ?? 'Active',
      createdAt: now,
      updatedAt: now,
    }
    writeJson(goalsKey, [created, ...goals])
    return created
  },

  updateGoal(goalId: string, patch: Partial<GoalInput>): Goal {
    const goals = localStoreApi.getGoals()
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            ...patch,
            updatedAt: new Date().toISOString(),
          }
        : goal,
    )
    writeJson(goalsKey, updatedGoals)
    const updated = updatedGoals.find((goal) => goal.id === goalId)
    if (!updated) {
      throw new Error('Goal not found')
    }
    return updated
  },

  getTasks(goalId: string): LearningTask[] {
    const tasks = readJson(tasksKey, seedTasks)
    return tasks
      .filter((task) => task.goalId === goalId)
      .sort((a, b) => a.order - b.order)
  },

  getAllTasks(): LearningTask[] {
    const tasks = readJson(tasksKey, seedTasks)
    return [...tasks].sort((a, b) => {
      if (a.goalId !== b.goalId) {
        return a.goalId.localeCompare(b.goalId)
      }
      return a.order - b.order
    })
  },

  createTask(goalId: string, input: TaskInput): LearningTask {
    const tasks = readJson(tasksKey, seedTasks)
    const order = Math.max(...tasks.filter((x) => x.goalId === goalId).map((x) => x.order), 0) + 1
    const created: LearningTask = {
      id: newId('task'),
      goalId,
      title: input.title,
      description: input.description,
      status: input.status ?? 'Todo',
      order,
      createdAt: new Date().toISOString(),
    }
    writeJson(tasksKey, [...tasks, created])
    return created
  },

  updateTask(taskId: string, patch: Partial<TaskInput>): LearningTask {
    const tasks = readJson(tasksKey, seedTasks)
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...patch,
          }
        : task,
    )
    writeJson(tasksKey, updatedTasks)
    const updated = updatedTasks.find((task) => task.id === taskId)
    if (!updated) {
      throw new Error('Task not found')
    }
    return updated
  },

  deleteTask(taskId: string): void {
    const tasks = readJson(tasksKey, seedTasks)
    writeJson(
      tasksKey,
      tasks.filter((task) => task.id !== taskId),
    )
  },
}
