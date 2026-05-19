import { Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  try {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/auth" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}
