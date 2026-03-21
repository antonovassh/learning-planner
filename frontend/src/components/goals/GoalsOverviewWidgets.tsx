import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import type { Goal } from '../../shared/api/types'
import { GOAL_STATUS_COLORS } from '../../shared/ui/statusColors'

type Props = {
  goals: Goal[]
  isLoading?: boolean
}

function buildDonutConicGradient(active: number, completed: number, archived: number): string {
  const total = active + completed + archived
  if (total === 0) {
    return 'conic-gradient(#e8e8e8 0deg 360deg)'
  }
  const pActive = (active / total) * 100
  const pCompleted = (completed / total) * 100
  const a = GOAL_STATUS_COLORS.Active.bg
  const c = GOAL_STATUS_COLORS.Completed.bg
  const r = GOAL_STATUS_COLORS.Archived.bg
  const x1 = pActive
  const x2 = pActive + pCompleted
  return `conic-gradient(${a} 0% ${x1}%, ${c} ${x1}% ${x2}%, ${r} ${x2}% 100%)`
}

export default function GoalsOverviewWidgets({ goals, isLoading }: Props) {
  const stats = useMemo(() => {
    let active = 0
    let completed = 0
    let archived = 0
    for (const g of goals) {
      if (g.status === 'Active') active += 1
      else if (g.status === 'Completed') completed += 1
      else archived += 1
    }
    const total = goals.length
    const notCompleted = active + archived
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { active, completed, archived, total, notCompleted, completedPct }
  }, [goals])

  if (isLoading) {
    return (
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Skeleton variant="rounded" height={160} sx={{ flex: 1, borderRadius: 4 }} />
        <Skeleton variant="rounded" height={160} sx={{ flex: 1, borderRadius: 4 }} />
      </Stack>
    )
  }

  const { active, completed, archived, total, notCompleted, completedPct } = stats
  const donutBg = buildDonutConicGradient(active, completed, archived)

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <Card
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 4,
          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.06)',
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Completion
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {total === 0
              ? 'No goals yet'
              : `${completed} of ${total} goal${total === 1 ? '' : 's'} completed (${completedPct}%)`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              height: 14,
              borderRadius: 7,
              overflow: 'hidden',
              bgcolor: 'grey.200',
            }}
          >
            {total > 0 ? (
              <>
                <Box
                  sx={{
                    flex: completed,
                    minWidth: completed > 0 ? 4 : 0,
                    bgcolor: GOAL_STATUS_COLORS.Completed.bg,
                    transition: 'flex 0.3s ease',
                  }}
                />
                <Box
                  sx={{
                    flex: notCompleted,
                    minWidth: notCompleted > 0 ? 4 : 0,
                    bgcolor: GOAL_STATUS_COLORS.Active.bg,
                    transition: 'flex 0.3s ease',
                  }}
                />
              </>
            ) : null}
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: GOAL_STATUS_COLORS.Completed.bg,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Completed · {completed}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: GOAL_STATUS_COLORS.Active.bg,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Not completed · {notCompleted}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 4,
          boxShadow: '0 8px 20px rgba(79, 70, 229, 0.06)',
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <Box sx={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: donutBg,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '58%',
                  height: '58%',
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: (t) => `inset 0 0 0 1px ${t.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {total}
                </Typography>
              </Box>
            </Box>
            <Stack spacing={1} sx={{ flex: 1, minWidth: 140 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                By status
              </Typography>
              <LegendRow color={GOAL_STATUS_COLORS.Active.bg} label="Active" count={active} />
              <LegendRow color={GOAL_STATUS_COLORS.Completed.bg} label="Completed" count={completed} />
              <LegendRow color={GOAL_STATUS_COLORS.Archived.bg} label="Archived" count={archived} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

function LegendRow({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {count}
      </Typography>
    </Stack>
  )
}
