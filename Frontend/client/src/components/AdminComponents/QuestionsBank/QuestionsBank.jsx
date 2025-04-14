import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  SubNavbar,
  ViewQuestions,
} from "../../../componentsLoader/ComponentsLoader";

export default function QuestionsBank({ userDetailes, darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const questionsBankSubNav = [
    {
      id: 1,
      text: "Preview Questions",
      path: "/admin/questions_bank/preview",
    },
    {
      id: 2,
      text: "Add Question",
      path: "/admin/questions_bank/add_question",
    },
  ];
  //
  useEffect(() => {
    if (location.pathname === "/admin/questions_bank") {
      navigate("/admin/questions_bank/preview");
    }
  }, [navigate, location.pathname]);
  return (
    <>
      <div className="d-flex justify-content-center w-100 align-items-center">
        <Suspense
          fallback={
            <div className="center-container">
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          <SubNavbar values={questionsBankSubNav} />
        </Suspense>{" "}
      </div>

      <Outlet />
    </>
  );
}
