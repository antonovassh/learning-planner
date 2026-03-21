import { Container, Typography } from '@mui/material'

export default function AllTasksPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        All tasks
      </Typography>
      <Typography color="text.secondary">Coming soon — all tasks across goals in one place.</Typography>
    </Container>
  )
}
