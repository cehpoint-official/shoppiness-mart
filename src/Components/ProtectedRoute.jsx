import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect = "/",
}) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if (adminOnly && !admin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
