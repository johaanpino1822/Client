import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
