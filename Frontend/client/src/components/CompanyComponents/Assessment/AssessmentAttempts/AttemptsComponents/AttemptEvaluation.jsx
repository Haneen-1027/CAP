import React from "react";
import { BackBtn } from "../../../../../componentsLoader/ComponentsLoader";

export default function AttemptEvaluation({ darkMode }) {
  return (
    <>
      <BackBtn />
      <div
        className={`card my-4 ${darkMode ? "spic-dark-mode border-light" : ""}`}
      >
        <div
          className={`p-4 card-header d-flex flex-column flex-md-row gap-3 align-md-center ${
            darkMode ? "border-light" : ""
          }`}
        >
          <div>
            <p className={`${darkMode ? "text-light" : "text-muted"} m-0`}>
              <span className="badge bg-success">4 marks</span>
              <strong className="ms-3">Question #1:</strong>
            </p>
          </div>
          <div>
            <p className="h5 m-0">
              <strong>This is an Example Prompt ..............</strong>
            </p>
          </div>
        </div>
        <div
          className={`p-4 card-header d-flex flex-column flex-md-row gap-3 align-md-center ${
            darkMode ? "border-light" : ""
          }`}
        ></div>
      </div>
    </>
  );
}
