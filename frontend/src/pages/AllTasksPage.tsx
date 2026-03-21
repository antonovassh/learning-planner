import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getGoals } from '../shared/api/goals'
import { deleteTask, getAllTasks, updateTask } from '../shared/api/tasks'
import type { TaskStatus } from '../shared/api/types'
import { formatAppDateTime } from '../shared/lib/formatDate'
import { getTaskStatusChipSx } from '../shared/ui/statusColors'

export default function AllTasksPage() {
  const queryClient = useQueryClient()

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: getAllTasks,
  })

  const goalTitleById = new Map((goalsQuery.data ?? []).map((g) => [g.id, g.title]))

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        All tasks
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        All tasks across your goals.
      </Typography>

      {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {tasksQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load tasks.
        </Alert>
      ) : null}

      {!isLoading && tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet. Add tasks from a goal on Overview.</Typography>
      ) : null}

      <Stack spacing={2}>
        {tasks.map((task) => {
          const goalTitle = goalTitleById.get(task.goalId) ?? 'Unknown goal'
          return (
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
                    <Button
                      component={RouterLink}
                      to={`/goals/${task.goalId}`}
                      size="small"
                      sx={{ mt: 0.5, mb: 1, p: 0, minWidth: 0, textAlign: 'left' }}
                    >
                      {goalTitle}
                    </Button>
                    <Typography variant="body2" color="text.secondary" mb={1}>
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
                    <Button color="error" onClick={() => deleteMutation.mutate(task.id)}>
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </Container>
  )
}
