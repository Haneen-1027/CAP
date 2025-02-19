import React from "react";
import { Link } from "react-router-dom";

export default function RenderVisibleAssessments({
  darkMode,
  role,
  assessments,
  deleteAssessment,
  timeFilteration,
}) {
  console.log("assess: ", assessments);
  function renderAssessments() {
    return assessments.map((assess, index) => {
      if (
        assess.time > timeFilteration.start_date &&
        assess.time < timeFilteration.end_date
      )
        return (
          <tr key={index}>
            <td>{index < 10 ? "0" + (index + 1) : index + 1}</td>
            <td className="">
              <strong>{assess.name}</strong>
            </td>
            {role === "Admin" ? <td>{assess.createdBy}</td> : ""}
            <td>{assess.time}</td>
            <td>
              <span className="bg-label-primary text-primary me-1">
                {assess.questions.length}
              </span>
            </td>
            <td>
              <div className="d-flex gap-2 justify-content-center">
                <Link
                  to={`/assessment/${1}`}
                  className="btn btn-sm btn-outline-primary"
                  title="Edit"
                >
                  <i className="fas fa-edit"></i>
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  title="Delete"
                  onClick={() => deleteAssessment(1234)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        );
    });
  }
  ////////////
  return (
    <>
      <div
        className={`table-responsive text-nowrap ${
          darkMode ? "spic-dark-mode" : ""
        }`}
      >
        <table className="table">
          <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
            <tr>
              <th>#</th>
              <th>Title</th>
              {role === "Admin" ? <th>Creator</th> : ""}
              <th>Date</th>
              <th>Questions Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-border-bottom-0">
            {assessments.length === 0 ? "Loading ..." : renderAssessments()}
          </tbody>
        </table>
      </div>
    </>
  );
}
