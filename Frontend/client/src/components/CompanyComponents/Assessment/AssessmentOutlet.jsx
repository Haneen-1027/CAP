import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function AssessmentOutlet() {
  const navigate = useNavigate();
  const location = useLocation();
  //
  useEffect(() => {
    if (location.pathname === "/assessment") {
      navigate("/assessment/view");
    }
  }, [navigate, location.pathname]);
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
