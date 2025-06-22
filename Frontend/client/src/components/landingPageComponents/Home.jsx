import React from "react";
import { Link } from "react-router-dom";

export default function Home({ darkMode }) {
  return (
    <div
      className={`container-fluid bg-light min-vh-100 d-flex align-items-center ${
        darkMode ? "spic-dark-mode text-white" : ""
      }`}
    >
      <div className="text-center">
        {/* Header Section */}
        <h1 className="display-4 fw-bold">
          Join <span className="text-success">MENA</span> Engineering Team
        </h1>
        <p className={`lead ${darkMode ? "text-white" : "text-muted"} fw-bold`}>
          Show Us Your Skills — Not Just Your CV
        </p>
        <p className={`lead ${darkMode ? "text-white" : "text-muted"}`}>
          We believe talent should be measured by ability, not credentials.
          That’s why we use our in-house coding assessment platform to evaluate
          real-world skills in a fair, challenge-based environment.
        </p>

        <hr className="my-5" />
        {/* Features Section */}
        <div className="row">
          <h1 className="h2 fw-bold mb-4">
            💡 Why <span className="text-success">MENA</span> Does It
            Differently
          </h1>
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">✅ Skill-Based Evaluation</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                Tackle problems similar to what we solve every day at MENA.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">🔒 Fair & Secure Evaluation</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                We focus on what you solve, not how fast you type! We care how
                you think and build.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`card shadow-sm p-4 ${
                darkMode ? "dark-theme text-white" : ""
              }`}
            >
              <h5 className="fw-bold">📈 Quick Feedback</h5>
              <p className={`${darkMode ? "text-light" : "text-muted"}`}>
                Get notified fast. No ghosting. If you pass, you move on to
                interviews quickly.
              </p>
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div>
          <p
            className={`lead ${darkMode ? "text-white" : "text-muted"} fw-bold`}
          >
            🧠 Put Your Skills to the Test! We can’t wait to meet you.
          </p>
        </div>
        {/* Call to Actions */}
        <div className="">
          <Link to="/login" className="btn btn-success btn-lg mx-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-outline-success btn-lg mx-2">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
