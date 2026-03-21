import { Navigate, Route, Routes } from 'react-router-dom'
import GoalDetailsPage from './pages/GoalDetailsPage'
import GoalsPage from './pages/GoalsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/goals" replace />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
