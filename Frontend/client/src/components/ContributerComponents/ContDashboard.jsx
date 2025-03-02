import React, { useState } from "react";
import { Link } from "react-router";
import "./Assessments/Assessments.css";

export default function ContDashboard({ userDetailes, darkMode }) {

  const [user, setUser] = useState({ ...userDetailes });
  // State to manage visible assessments
  const [visibleCount, setVisibleCount] = useState(2);
  const [expanded, setExpanded] = useState(false); // Track whether the list is expanded

  // Assessment data
  const assessments = [
    { title: "JavaScript Advanced Assessment", status: "In Progress", badgeClass: "bg-warning text-dark" },
    { title: "React Basics Assessment", status: "Not Started", badgeClass: "bg-secondary" },
    { title: "HTML & CSS Assessment", status: "Completed", badgeClass: "bg-success" },
    { title: "HTML & CSS Assessment", status: "Completed", badgeClass: "bg-success" },
    { title: "HTML & CSS Assessment", status: "Completed", badgeClass: "bg-success" },
  ];

  const toggleVisibility = () => {
    if (expanded) {
      setVisibleCount(2); // Collapse to 3 items
    } else {
      setVisibleCount(assessments.length); // Expand to show all items
    }
    setExpanded(!expanded); // Toggle the state
  };

  return (

    <div className="container my-5">
      <div className="row g-4">
        {/* Profile Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className={`card-body card2 text-center ${darkMode ? "spic-dark-mode text-light" : ""
              } `}>

              <h5 className="card-title">{user.firstName} {user.lastName}</h5>
              <p className={`card-text ${darkMode ? "spic-dark-mode text-white" : "text-muted"
                }  `}>{user.bio}</p>
              <Link className="btn btn-primary btn-sm" to={`/profile/${user.id}`}>
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "spic-dark-mode text-light" : ""}`}>
              <h5 className="card-title">Performance Overview</h5>
              <div className="row text-center mt-4">
                <div className="col-md-4">
                  <h4 className="text-primary">85%</h4>
                  <p className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                    }`}>Assessment Completion</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-warning">92%</h4>
                  <p className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                    }`}>Accuracy</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-success">7</h4>
                  <p className={`${darkMode ? "spic-dark-mode text-white" : "text-muted"
                    }`}>Assessments Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "spic-dark-mode text-white" : ""
              }`}>
              <h5 className="card-title">Active Assessments</h5>
              <Link className="btn btn-primary btn-sm" type="button" to="/contributer/assessments">
                Show Details
              </Link>
              <ul className="list-group mt-3">
                {assessments.slice(0, visibleCount).map((assessment, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? "spic-dark-mode text-white" : ""
                      }`}
                  >
                    {assessment.title}
                    <span className={`badge ${assessment.badgeClass}`}>{assessment.status}</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-link mt-3" onClick={toggleVisibility}>
                {expanded ? "See Less" : "See More"}
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "spic-dark-mode text-light" : ""}`}>
              <h5 className="card-title">Results</h5>
              <ul className="list-group mt-3">
                <li className={`list-group-item d-flex justify-content-between ${darkMode ? "spic-dark-mode text-white" : ""
                  }`}>
                  <span> HTML & CSS Assessment </span><span className="text-success"> 8 / 10</span>
                </li>
                <li className={`list-group-item d-flex justify-content-between  ${darkMode ? "spic-dark-mode text-white" : ""
                  }`}>
                  <span>JavaScript Advanced Assessment</span> <span className="text-danger"> 6 / 15</span>
                </li>
              </ul>
              <Link
                className="btn btn-primary btn-sm mt-4"
                type="button"
                to="/contributer/result"
              >
                Show all result
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
