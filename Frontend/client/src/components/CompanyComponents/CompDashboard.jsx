import React, { useState } from "react";
import { Link } from "react-router";

export default function CompDashboard({ user, darkMode }) {
  const [companyDetails, setCompanyDetails] = useState({ ...user });
  const [visibleCount, setVisibleCount] = useState(2);
  const [expanded, setExpanded] = useState(false);

  // Assessment data created by the company
  const assessments = [
    { title: "JavaScript Advanced Assessment", date: "2025-02-15" },
    { title: "React Basics Assessment", date: "2025-02-15" },
    { title: "HTML & CSS Assessment", date: "2025-02-15" },
    { title: "Python Coding Challenge", date: "2025-02-15" },
    { title: "Data Structures Quiz", date: "2025-02-15" },
  ];

  const toggleVisibility = () => {
    if (expanded) {
      setVisibleCount(2); // Collapse to show fewer items
    } else {
      setVisibleCount(assessments.length); // Expand to show all items
    }
    setExpanded(!expanded); // Toggle the state
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Company Profile Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div
              className={`card-body card2 text-center ${darkMode ? "spic-dark-mode text-light" : ""
                }`}
            >
              <h5 className="card-title">Welcome <strong>{companyDetails.firstName} {companyDetails.lastName}</strong></h5>
              <p
                className={`card-text ${darkMode ? "spic-dark-mode text-white" : "text-muted"
                  }`}
              >
                {companyDetails.bio || "No description available."}
              </p>
              <Link
                className="btn btn-primary btn-sm"
                to={`/profile/${companyDetails.id}`}
              >
                View Company Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Company Statistics Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div
              className={`card-body ${darkMode ? "spic-dark-mode text-light" : ""}`}
            >
              <h5 className="card-title">Company Performance Overview</h5>
              <div className="row text-center mt-4">
                <div className="col-md-4">
                  <h4 className="text-primary">50+</h4>
                  <p
                    className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                      }`}
                  >
                    Assessments Created
                  </p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-warning">1,200+</h4>
                  <p
                    className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                      }`}
                  >
                    Candidates Evaluated
                  </p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-success">95%</h4>
                  <p
                    className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                      }`}
                  >
                    Success Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Section */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100 ">
            <div
              className={`card-body ${darkMode ? "spic-dark-mode text-white" : ""}`}
            >
              <div className=" d-flex justify-content-between">
                <h5 className="card-title">Active Assessments</h5>
                <Link
                  className="btn btn-primary btn-sm"
                  type="button"
                  to="/assessment/view"
                >
                  Manage Assessments
                </Link>
              </div>

              <ul className="list-group mt-4">
                <li class="list-group-item active d-flex justify-content-between align-items-center border border-light">
                  <span>title</span>
                  <span>date</span>
                </li>
                {assessments.slice(0, visibleCount).map((assessment, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? "spic-dark-mode text-white" : ""
                      }`}
                  >
                    {assessment.title}

                    <span>
                      {assessment.date}
                    </span>

                  </li>
                ))}
              </ul>
              <button
                className="btn btn-link mt-3"
                onClick={toggleVisibility}
              >
                {expanded ? "See Less" : "See More"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "spic-dark-mode text-light" : ""}`}>
              <h5 className="card-title">Question Management</h5>
              <div className="mt-3">
                {/* Total Questions */}
                <p className="card-text">
                  <strong>Total Questions:</strong> 50
                </p>

                {/* Question Types Breakdown */}
                <p className="card-text">
                  <strong>Question Types:</strong>
                </p>
                <ul className="list-group">
                  <li
                    className={`list-group-item ${darkMode ? "spic-dark-mode text-white" : ""
                      }`}
                  >
                    Coding: <span className="text-primary">20</span>
                  </li>
                  <li
                    className={`list-group-item ${darkMode ? "spic-dark-mode text-white" : ""
                      }`}
                  >
                    Multiple-Choice: <span className="text-primary">15</span>
                  </li>
                  <li
                    className={`list-group-item ${darkMode ? "spic-dark-mode text-white" : ""
                      }`}
                  >
                    Theoretical: <span className="text-primary">15</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}