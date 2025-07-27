import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function UsersController() {
  const navigate = useNavigate();
  const location = useLocation();
  ///
  useEffect(() => {
    if (location.pathname === "/company/users") {
      navigate("/company/users/preview");
    }
  }, [navigate, location.pathname]);
  ///
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
