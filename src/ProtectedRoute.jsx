import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    // Ikke logget ind
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Ikke korrekt rolle
    return <Navigate to="/login" replace />
  }

  return children
}
