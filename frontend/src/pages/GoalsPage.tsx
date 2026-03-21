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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'
import { z } from 'zod'
import { createGoal, getGoals, updateGoal } from '../shared/api/goals'
import type { GoalInput } from '../shared/api/types'

const goalSchema = z.object({
  title: z.string().trim().min(3, 'Minimum 3 characters'),
  description: z.string().trim().max(400).optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

const goalsQueryKey = ['goals']

function statusColor(status: string): 'default' | 'success' | 'warning' {
  if (status === 'Completed') return 'success'
  if (status === 'Archived') return 'warning'
  return 'default'
}

export default function GoalsPage() {
  const [isOpen, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: goalsQueryKey,
    queryFn: getGoals,
  })

  const createMutation = useMutation({
    mutationFn: (input: GoalInput) => createGoal(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: goalsQueryKey })
      setOpen(false)
      reset()
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (goalId: string) => updateGoal(goalId, { status: 'Archived' }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  })

  const { control, handleSubmit, reset } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values)
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Goals
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add goal
        </Button>
      </Stack>

      {isLoading ? <LinearProgress /> : null}
      {isError ? <Alert severity="error">Failed to load goals.</Alert> : null}

      <Stack spacing={2} mt={2}>
        {(data ?? []).map((goal) => (
          <Card
            key={goal.id}
            variant="outlined"
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.08)',
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box>
                  <Typography variant="h6">{goal.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {goal.description || 'No description'}
                  </Typography>
                  <Chip size="small" label={goal.status} color={statusColor(goal.status)} />
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button component={RouterLink} to={`/goals/${goal.id}`} variant="outlined">
                    Open
                  </Button>
                  {goal.status !== 'Archived' ? (
                    <Button
                      color="warning"
                      variant="text"
                      onClick={() => archiveMutation.mutate(goal.id)}
                    >
                      Archive
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={isOpen} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create new goal</DialogTitle>
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
