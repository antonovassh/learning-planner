import { Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4" fontWeight={700}>
          Page not found
        </Typography>
        <Typography color="text.secondary">
          The route does not exist. Open goals page to continue.
        </Typography>
        <Button component={RouterLink} to="/goals" variant="contained">
          Go to goals
        </Button>
      </Stack>
    </Container>
  )
}
