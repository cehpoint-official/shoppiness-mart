import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly = false,
  redirect = "/",
}) => {
  // Only select the specific user data needed, not the entire state
  const user = useSelector((state) =>
    adminOnly ? state.userReducer.user : state.userReducer.user
  );
  const isAdmin = user?.role === "admin";

  if (!isAuthenticated) return <Navigate to={redirect} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
