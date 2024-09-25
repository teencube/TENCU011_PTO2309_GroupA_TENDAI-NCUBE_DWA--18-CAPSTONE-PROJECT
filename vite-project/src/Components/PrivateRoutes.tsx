import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import  useAuth  from '../Components/useAuth'; 

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect to login page if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
