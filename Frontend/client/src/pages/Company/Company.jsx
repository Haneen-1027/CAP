import "./Company.css";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function Company({ user }) {
  const location = useLocation();

  if (!user) {
    // Not logged in (optional check)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "Company") {
    return <Navigate to="/AuthorizeError" replace />;
  }
  return <Outlet />;
}
