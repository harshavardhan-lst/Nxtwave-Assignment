import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

/**
 * Renders children when jwt_token cookie exists; otherwise redirects to /login.
 * The wildcard (*) route must NOT be wrapped here.
 */
export default function ProtectedRoute({ children }) {
  const token = Cookies.get('jwt_token')
  return token ? children : <Navigate to="/login" replace />
}
