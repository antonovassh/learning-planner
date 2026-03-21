import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getGoals } from '../shared/api/goals'
import { deleteTask, getAllTasks, updateTask } from '../shared/api/tasks'
import type { LearningTask, TaskStatus } from '../shared/api/types'
import { formatAppDateTime } from '../shared/lib/formatDate'
import { archiveOrDeleteButtonSx } from '../shared/ui/appStyles'
import { getTaskStatusChipSx } from '../shared/ui/statusColors'

type StatusSortMode = 'done_first' | 'todo_first'

const STATUS_RANK_DONE_FIRST: Record<TaskStatus, number> = {
  Done: 0,
  InProgress: 1,
  Todo: 2,
}

const STATUS_RANK_TODO_FIRST: Record<TaskStatus, number> = {
  Todo: 0,
  InProgress: 1,
  Done: 2,
}

function sortTasksByStatus(
  list: LearningTask[],
  rank: Record<TaskStatus, number>,
): LearningTask[] {
  return [...list].sort((a, b) => {
    const byStatus = rank[a.status] - rank[b.status]
    if (byStatus !== 0) return byStatus
    if (a.order !== b.order) return a.order - b.order
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

export default function AllTasksPage() {
  const queryClient = useQueryClient()
  const [statusSort, setStatusSort] = useState<StatusSortMode>('done_first')

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: getAllTasks,
  })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTask(taskId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', 'all'] })
      void queryClient.invalidateQueries({ queryKey: ['goals'] })
      void queryClient.invalidateQueries({ queryKey: ['goal'] })
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', 'all'] })
      void queryClient.invalidateQueries({ queryKey: ['goals'] })
      void queryClient.invalidateQueries({ queryKey: ['goal'] })
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const tasks = tasksQuery.data ?? []
  const isLoading = tasksQuery.isLoading || goalsQuery.isLoading

  const rank = statusSort === 'done_first' ? STATUS_RANK_DONE_FIRST : STATUS_RANK_TODO_FIRST

  /** Tasks grouped by goalId; sections ordered A→Z by goal title */
  const tasksByGoalSections = useMemo(() => {
    const titles = new Map((goalsQuery.data ?? []).map((g) => [g.id, g.title]))
    const byGoal = new Map<string, LearningTask[]>()
    for (const t of tasks) {
      const list = byGoal.get(t.goalId) ?? []
      list.push(t)
      byGoal.set(t.goalId, list)
    }

    const goalIds = [...byGoal.keys()].sort((ga, gb) => {
      const titleA = titles.get(ga) ?? `\uffff${ga}`
      const titleB = titles.get(gb) ?? `\uffff${gb}`
      return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' })
    })

    return goalIds.map((goalId) => ({
      goalId,
      title: titles.get(goalId) ?? 'Unknown goal',
      tasks: sortTasksByStatus(byGoal.get(goalId) ?? [], rank),
    }))
  }, [tasks, rank, goalsQuery.data])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        All tasks
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Tasks grouped by goal. Sorting applies within each goal.
      </Typography>

      {tasks.length > 0 ? (
        <FormControl size="small" sx={{ minWidth: 280, maxWidth: '100%', mb: 2 }}>
          <InputLabel id="all-tasks-sort-label">Sort tasks within each goal</InputLabel>
          <Select
            labelId="all-tasks-sort-label"
            id="all-tasks-sort"
            label="Sort tasks within each goal"
            value={statusSort}
            onChange={(e) => setStatusSort(e.target.value as StatusSortMode)}
          >
            <MenuItem value="done_first">Done → In progress → Todo</MenuItem>
            <MenuItem value="todo_first">Todo → In progress → Done</MenuItem>
          </Select>
        </FormControl>
      ) : null}

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {tasksQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load tasks.
        </Alert>
      ) : null}

      {!isLoading && tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet. Add tasks from a goal on Overview.</Typography>
      ) : null}

      <Stack spacing={4}>
        {tasksByGoalSections.map(({ goalId, title, tasks: goalTasks }) => (
          <Box key={goalId}>
            <Typography
              variant="h6"
              component={RouterLink}
              to={`/goals/${goalId}`}
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'inline-block',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {title}
            </Typography>
            <Stack spacing={2}>
              {goalTasks.map((task) => (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)',
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h6" component="h2" fontWeight={600}>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1} mt={0.5}>
                          {task.description?.trim() ? task.description : 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Chip label={task.status} size="small" sx={getTaskStatusChipSx(task.status)} />
                          <Typography variant="caption" color="text.secondary">
                            Order {task.order} · Created {formatAppDateTime(task.createdAt)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Select
                          size="small"
                          value={task.status}
                          onChange={(e) =>
                            updateMutation.mutate({
                              taskId: task.id,
                              status: e.target.value as TaskStatus,
                            })
                          }
                        >
                          <MenuItem value="Todo">Todo</MenuItem>
                          <MenuItem value="InProgress">In progress</MenuItem>
                          <MenuItem value="Done">Done</MenuItem>
                        </Select>
                        <Button
                          variant="text"
                          sx={archiveOrDeleteButtonSx}
                          onClick={() => deleteMutation.mutate(task.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  )
}
