import type { GoalStatus, TaskStatus } from '../api/types'

/** Custom palette for goal status chips */
export const GOAL_STATUS_COLORS: Record<GoalStatus, { bg: string; color: string }> = {
  Active: { bg: '#dec9e9', color: '#2d1b3d' },
  Completed: { bg: '#b185db', color: '#2d1b3d' },
  Archived: { bg: '#6247aa', color: '#ffffff' },
}

/** Custom palette for task status chips */
export const TASK_STATUS_COLORS: Record<TaskStatus, { bg: string; color: string }> = {
  Todo: { bg: '#dec9e9', color: '#2d1b3d' },
  InProgress: { bg: '#b185db', color: '#2d1b3d' },
  Done: { bg: '#6247aa', color: '#ffffff' },
}

const goalFallback = { bg: '#e8e8e8', color: '#424242' }
const taskFallback = { bg: '#e8e8e8', color: '#424242' }

export function getGoalStatusChipSx(status: string) {
  const palette = GOAL_STATUS_COLORS[status as GoalStatus] ?? goalFallback
  return {
    bgcolor: palette.bg,
    color: palette.color,
    fontWeight: 600,
    '& .MuiChip-label': { px: 1.25 },
  } as const
}

export function getTaskStatusChipSx(status: string) {
  const palette = TASK_STATUS_COLORS[status as TaskStatus] ?? taskFallback
  return {
    bgcolor: palette.bg,
    color: palette.color,
    fontWeight: 600,
    '& .MuiChip-label': { px: 1.25 },
  } as const
}
