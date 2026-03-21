import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import AppNavDrawer from './AppNavDrawer'

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppNavDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
