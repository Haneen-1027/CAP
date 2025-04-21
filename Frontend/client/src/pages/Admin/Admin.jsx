import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function Admin({ user }) {
  const location = useLocation();

  if (!user) {
    // Not logged in (optional check)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/AuthorizeError" replace />;
  }
  return <Outlet />;
}
