import React from "react";
import { Link } from "react-router-dom";

export default function Home({ darkMode }) {
  return (
    <div
      className={`container-fluid bg-light min-vh-100 d-flex align-items-center ${
        darkMode ? "spic-dark-mode text-white" : ""
      }`}
    >
      <div className="container text-center">
        {/* Header Section */}
        <h1 className="display-4 fw-bold">
          Welcome to Code Execution Platform
        </h1>
        <p className={`lead ${darkMode ? "text-white" : "text-muted"}`}>
          Test your coding skills, run code instantly, and take coding
          assessments with ease.
        </p>

        {/* Call to Actions */}
        <div className="mt-4">
          <Link to="/login" className="btn btn-success btn-lg mx-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-outline-success btn-lg mx-2">
            Sign Up
          </Link>
        </div>

        {/* Features Section */}
        <div className="row mt-5">
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">Live Code Execution</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                Run your code instantly in multiple programming languages.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">Coding Assessments</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                Take coding challenges and improve your problem-solving skills.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">Leaderboard</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                Compete with others and track your progress on our global
                leaderboard.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-5 ${darkMode ? "text-white" : "text-muted"}`}>
          <p>
            &copy; {new Date().getFullYear()} Code Execution Platform. All
            rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
