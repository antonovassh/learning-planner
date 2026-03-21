import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { z } from 'zod'
import { getGoals } from '../shared/api/goals'
import { createTask, deleteTask, getTasks, updateTask } from '../shared/api/tasks'
import type { TaskInput, TaskStatus } from '../shared/api/types'

const taskSchema = z.object({
  title: z.string().trim().min(3, 'Minimum 3 characters'),
  description: z.string().trim().max(400).optional(),
  status: z.enum(['Todo', 'InProgress', 'Done']),
})

type TaskFormValues = z.infer<typeof taskSchema>

const statusColorMap: Record<TaskStatus, 'default' | 'warning' | 'success'> = {
  Todo: 'default',
  InProgress: 'warning',
  Done: 'success',
}

export default function GoalDetailsPage() {
  const { goalId } = useParams()
  const queryClient = useQueryClient()
  const [isOpen, setOpen] = useState(false)

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks', goalId],
    queryFn: () => getTasks(goalId ?? ''),
    enabled: Boolean(goalId),
  })

  const createMutation = useMutation({
    mutationFn: (input: TaskInput) => createTask(goalId ?? '', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', goalId] })
      reset()
      setOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTask(taskId, { status }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['tasks', goalId] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['tasks', goalId] }),
  })

  const goal = useMemo(
    () => goalsQuery.data?.find((item) => item.id === goalId),
    [goalsQuery.data, goalId],
  )

  const { control, handleSubmit, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Todo',
    },
  })

  const onSubmit = handleSubmit((values) => createMutation.mutate(values))

  if (!goalId) {
    return <Alert severity="error">Goal id is missing in URL.</Alert>
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {goal?.title ?? 'Goal details'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tasks for this goal
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/goals" variant="outlined">
            Back
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add task
          </Button>
        </Stack>
      </Stack>

      {tasksQuery.isLoading ? <LinearProgress sx={{ mt: 2 }} /> : null}
      {tasksQuery.isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load tasks.
        </Alert>
      ) : null}

      <Stack spacing={2} mt={2}>
        {(tasksQuery.data ?? []).map((task) => (
          <Card
            key={task.id}
            variant="outlined"
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)',
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {task.description || 'No description'}
                  </Typography>
                  <Chip label={task.status} color={statusColorMap[task.status]} size="small" />
                </Box>
                <Stack direction="row" spacing={1}>
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
        ))}
      </Stack>

      <Dialog open={isOpen} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create new task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  minRows={3}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSubmit} variant="contained" disabled={createMutation.isPending}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
