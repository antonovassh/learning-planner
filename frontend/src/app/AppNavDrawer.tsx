import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../shared/auth/AuthContext'

export const DRAWER_WIDTH = 260

const navLinkSx = {
  color: 'text.secondary',
  textDecoration: 'none',
  borderRadius: 1,
  mx: 1,
  '&.active': {
    color: 'primary.main',
    bgcolor: 'action.selected',
    '& .MuiListItemIcon-root': {
      color: 'primary.main',
    },
  },
}

export default function AppNavDrawer() {
  const { logout } = useAuth()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Toolbar sx={{ px: 2, alignItems: 'flex-start', pt: 2, pb: 1 }}>
        <Typography variant="h6" fontWeight={700} component="div">
          Learning Planner
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto', py: 1 }}>
        <List disablePadding>
          <ListItemButton component={NavLink} to="/goals" sx={navLinkSx}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FlagOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Overview" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/schedule" sx={navLinkSx}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CalendarMonthOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Schedule" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/tasks" sx={navLinkSx}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <TaskAltOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="All tasks" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </List>
      </Box>
      <Box sx={{ px: 2, py: 2, mt: 'auto' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutOutlinedIcon />}
          onClick={() => {
            void logout()
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  )
}
