import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router';
import { type RootState } from '../../store';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;