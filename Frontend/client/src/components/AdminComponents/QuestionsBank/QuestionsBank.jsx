import React from "react";
import { Link } from "react-router";

export default function QuestionsBank({ userDetailes, darkMode }) {
  return (
    <>
      <div className={`custom-form ${darkMode ? " spic-dark-mode" : ""}`}>
        <div className="my-4 mx-3 w-100">
          <h1
            className={`custom-form-header h3 ${darkMode ? "text-light" : ""}`}
          >
            What do you want to do?
          </h1>
        </div>
        <div className="w-50 position-relative my-4 mx-3">
          <hr className="bold-hr " />
        </div>
        <div className="position-relative my-4 px-5 mx-5 d-flex justify-content-between">
          <Link
            to={"/admin/questions_bank"}
            className={`p-8 d-flex flex-column align-items-center border all-Heavy-shadow ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <div className="primary-button-color mb-4 h2">
              <i className="fa fa-plus" aria-hidden="true" />
            </div>
            <div>
              <p className={`h5 ${darkMode ? "text-light" : "text-black"}`}>
                Add New Question
              </p>
            </div>
          </Link>
          <Link
            to={"/admin/questions_bank"}
            className={`p-8 d-flex flex-column align-items-center border all-Heavy-shadow ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <div className="primary-button-color mb-4 h2">
              <i className="fa fa-eye" aria-hidden="true" />
            </div>
            <div>
              <p className={`h5 ${darkMode ? "text-light" : "text-black"}`}>
                View Questions
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
