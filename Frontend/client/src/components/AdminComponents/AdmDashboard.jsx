import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdmDashboard({ user,darkMode }) {

  const [visibleCount, setVisibleCount] = useState(2);
  const [expanded, setExpanded] = useState(false);

  // Dummy Data for Dashboard
  const assessments = [
    { title: "Algorithm Challenge", date: "2025-02-20" },
    { title: "JavaScript Debugging", date: "2025-02-21" },
    { title: "SQL Query Optimization", date: "2025-02-22" },
    { title: "System Design Patterns", date: "2025-02-23" },
  ];

  const users = [
    { name: "John Doe", role: "Candidate", submissions: 12 },
    { name: "Alice Smith", role: "Admin", submissions: 5 },
    { name: "Bob Johnson", role: "Candidate", submissions: 8 },
  ];

  const toggleVisibility = () => {
    setVisibleCount(expanded ? 2 : assessments.length);
    setExpanded(!expanded);
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        
        {/* Admin Profile */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100 text-center">
            <div className={`card-body ${darkMode ? "bg-dark text-light" : ""}`}>
              <h5>Welcome, <strong>{user.firstName} {user.lastName}</strong></h5>
              <p className={`${darkMode ? "text-white" : "text-muted"}`}>
                {user.bio || "Admin for the coding platform."}
              </p>
              <Link className="btn btn-primary btn-sm" to="/admin/profile">
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "bg-dark text-light" : ""}`}>
              <h5>Platform Overview</h5>
              <div className="row text-center mt-4">
                <div className="col-md-3">
                  <h4 className="text-primary">12</h4>
                  <p>Assessments</p>
                </div>
                <div className="col-md-3">
                  <h4 className="text-warning">320</h4>
                  <p>Users Registered</p>
                </div>
                <div className="col-md-3">
                  <h4 className="text-success">85%</h4>
                  <p>Pass Rate</p>
                </div>
                <div className="col-md-3">
                  <h4 className="text-danger">8%</h4>
                  <p>Failed Attempts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Assessments */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "bg-dark text-white" : ""}`}>
              <div className="d-flex justify-content-between">
                <h5>Active Assessments</h5>
                <Link className="btn btn-primary btn-sm" to="/admin/assessments">
                  Manage
                </Link>
              </div>
              <ul className="list-group mt-4">
                {assessments.slice(0, visibleCount).map((a, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    {a.title} <span>{a.date}</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-link mt-3" onClick={toggleVisibility}>
                {expanded ? "See Less" : "See More"}
              </button>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className={`card-body ${darkMode ? "bg-dark text-light" : ""}`}>
              <h5>Users</h5>
              <ul className="list-group mt-3">
                {users.map((user, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    {user.name} <span>{user.role}</span>
                  </li>
                ))}
              </ul>
              <Link className="btn btn-primary btn-sm mt-3" to="/admin/users">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
