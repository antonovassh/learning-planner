import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './app/AppLayout'
import GoalDetailsPage from './pages/GoalDetailsPage'
import GoalsPage from './pages/GoalsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/goals" replace />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
