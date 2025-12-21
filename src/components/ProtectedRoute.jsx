import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  console.log(user,"heeeeloooo")
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user's role is not in the list
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'MANAGER') {
      return <Navigate to="/manager/dashboard" replace />;
    } else if (user.role === 'USER') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // Default fallback
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;