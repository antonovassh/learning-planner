import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './app/AppLayout'
import AllTasksPage from './pages/AllTasksPage'
import GoalDetailsPage from './pages/GoalDetailsPage'
import GoalsPage from './pages/GoalsPage'
import NotFoundPage from './pages/NotFoundPage'
import SchedulePage from './pages/SchedulePage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
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
