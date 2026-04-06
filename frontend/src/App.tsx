import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './app/AppLayout'
import AllTasksPage from './pages/AllTasksPage'
import GoalDetailsPage from './pages/GoalDetailsPage'
import GoalsPage from './pages/GoalsPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SchedulePage from './pages/SchedulePage'
import RequireAuth from './shared/auth/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/goals" replace />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/tasks" element={<AllTasksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
