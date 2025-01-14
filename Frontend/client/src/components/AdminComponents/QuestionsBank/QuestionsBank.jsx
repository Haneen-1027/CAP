import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { SubNavbar } from "../../../componentsLoader/ComponentsLoader";

export default function QuestionsBank({ userDetailes, darkMode }) {
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
  return (
    <>
      <div className="d-flex justify-content-center">
        <Suspense
          fallback={
            <div className="center-container">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          <SubNavbar values={questionsBankSubNav} />
        </Suspense>{" "}
      </div>
      <div className={`custom-form ${darkMode ? " spic-dark-mode" : ""}`}>
        <Outlet />
      </div>
    </>
  );
}
