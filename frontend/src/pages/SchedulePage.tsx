import { Container, Typography } from '@mui/material'

export default function SchedulePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Schedule
      </Typography>
      <Typography color="text.secondary">Coming soon — your study schedule will appear here.</Typography>
    </Container>
  )
}
