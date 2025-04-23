import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router";

export default function Users({ user, darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  //
  useEffect(() => {
    if (location.pathname === "/admin/users") {
      navigate("/admin/users/preview");
    }
  }, [navigate, location.pathname]);

  if (!user) {
    // Not logged in (optional check)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/AuthorizeError" replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
