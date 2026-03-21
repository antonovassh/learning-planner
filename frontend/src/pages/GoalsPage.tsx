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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'
import { z } from 'zod'
import GoalsOverviewWidgets from '../components/goals/GoalsOverviewWidgets'
import { createGoal, getGoals, updateGoal } from '../shared/api/goals'
import type { GoalInput, GoalStatus } from '../shared/api/types'
import { archiveOrDeleteButtonSx } from '../shared/ui/appStyles'
import { getGoalStatusChipSx } from '../shared/ui/statusColors'

const goalSchema = z.object({
  title: z.string().trim().min(3, 'Minimum 3 characters'),
  description: z.string().trim().max(400).optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

const goalsQueryKey = ['goals']

type GoalSortMode = 'active_first' | 'archived_first'

const GOAL_STATUS_RANK_ACTIVE_FIRST: Record<GoalStatus, number> = {
  Active: 0,
  Completed: 1,
  Archived: 2,
}

const GOAL_STATUS_RANK_ARCHIVED_FIRST: Record<GoalStatus, number> = {
  Archived: 0,
  Completed: 1,
  Active: 2,
}

export default function GoalsPage() {
  const [isOpen, setOpen] = useState(false)
  const [statusSort, setStatusSort] = useState<GoalSortMode>('active_first')
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

  const goals = data ?? []
  const sortedGoals = useMemo(() => {
    const rank =
      statusSort === 'active_first' ? GOAL_STATUS_RANK_ACTIVE_FIRST : GOAL_STATUS_RANK_ARCHIVED_FIRST
    return [...goals].sort((a, b) => {
      const byStatus = rank[a.status] - rank[b.status]
      if (byStatus !== 0) return byStatus
      const byTitle = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      if (byTitle !== 0) return byTitle
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [goals, statusSort])

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

      <GoalsOverviewWidgets goals={goals} isLoading={isLoading} />

      {goals.length > 0 ? (
        <FormControl size="small" sx={{ minWidth: 280, maxWidth: '100%', mb: 2, mt: 1 }}>
          <InputLabel id="goals-sort-label">Sort by status</InputLabel>
          <Select
            labelId="goals-sort-label"
            id="goals-sort"
            label="Sort by status"
            value={statusSort}
            onChange={(e) => setStatusSort(e.target.value as GoalSortMode)}
          >
            <MenuItem value="active_first">Active → Completed → Archived</MenuItem>
            <MenuItem value="archived_first">Archived → Completed → Active</MenuItem>
          </Select>
        </FormControl>
      ) : null}

      {isError ? <Alert severity="error">Failed to load goals.</Alert> : null}

      <Stack spacing={2} mt={2}>
        {sortedGoals.map((goal) => (
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
                  <Chip size="small" label={goal.status} sx={getGoalStatusChipSx(goal.status)} />
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button component={RouterLink} to={`/goals/${goal.id}`} variant="outlined">
                    Open
                  </Button>
                  {goal.status !== 'Archived' ? (
                    <Button variant="text" sx={archiveOrDeleteButtonSx} onClick={() => archiveMutation.mutate(goal.id)}>
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
