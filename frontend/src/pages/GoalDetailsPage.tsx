import { zodResolver } from '@hookform/resolvers/zod'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Divider,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { z } from 'zod'
import { getGoalById } from '../shared/api/goals'
import { createTask, deleteTask, getTasks, updateTask } from '../shared/api/tasks'
import type { TaskInput, TaskStatus } from '../shared/api/types'
import { formatAppDateTime } from '../shared/lib/formatDate'
import { archiveOrDeleteButtonSx } from '../shared/ui/appStyles'
import { getGoalStatusChipSx, getTaskStatusChipSx } from '../shared/ui/statusColors'

const taskSchema = z.object({
  title: z.string().trim().min(3, 'Minimum 3 characters'),
  description: z.string().trim().max(400).optional(),
  status: z.enum(['Todo', 'InProgress', 'Done']),
})

type TaskFormValues = z.infer<typeof taskSchema>

export default function GoalDetailsPage() {
  const { goalId } = useParams()
  const queryClient = useQueryClient()
  const [isOpen, setOpen] = useState(false)

  const goalQuery = useQuery({
    queryKey: ['goal', goalId],
    queryFn: () => getGoalById(goalId!),
    enabled: Boolean(goalId),
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
      void queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      void queryClient.invalidateQueries({ queryKey: ['goals'] })
      reset()
      setOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTask(taskId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', goalId] })
      void queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      void queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', goalId] })
      void queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      void queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

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
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Goal id is missing in URL.</Alert>
      </Container>
    )
  }

  const goal = goalQuery.data

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button component={RouterLink} to="/goals" variant="outlined">
          Back to goals
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add task
        </Button>
      </Stack>

      {goalQuery.isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
      {goalQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load this goal. It may have been removed.
        </Alert>
      ) : null}

      {goal ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 4,
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)',
            mb: 4,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap">
                <Typography variant="h5" fontWeight={700} component="h1">
                  {goal.title}
                </Typography>
                <Chip label={goal.status} size="small" sx={getGoalStatusChipSx(goal.status)} />
              </Stack>

              <Typography variant="body1" color="text.secondary">
                {goal.description?.trim() ? goal.description : 'No description'}
              </Typography>

              {goal.progress !== undefined ? (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {Math.round(Math.min(100, Math.max(0, Number(goal.progress))))}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, Number(goal.progress)))}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
              ) : null}

              <Divider />

              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Typography variant="body2" color="text.secondary">
                  Created: {formatAppDateTime(goal.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated: {formatAppDateTime(goal.updatedAt)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          borderRadius: '16px !important',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)',
          overflow: 'hidden',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Typography variant="h6" fontWeight={600}>
              Tasks
            </Typography>
            <Chip
              label={(tasksQuery.data ?? []).length}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
          <Stack spacing={2}>
            {tasksQuery.isLoading ? <LinearProgress /> : null}
            {tasksQuery.isError ? (
              <Alert severity="error">Failed to load tasks.</Alert>
            ) : null}

            {(tasksQuery.data ?? []).length === 0 && !tasksQuery.isLoading ? (
              <Typography color="text.secondary">
                No tasks yet. Add one with the button above.
              </Typography>
            ) : null}

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
                      <Button variant="text" sx={archiveOrDeleteButtonSx} onClick={() => deleteMutation.mutate(task.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

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
