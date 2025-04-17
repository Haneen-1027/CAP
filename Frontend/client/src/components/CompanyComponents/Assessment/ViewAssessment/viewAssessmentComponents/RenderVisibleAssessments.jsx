import React from "react";
import { Link } from "react-router-dom";
import { LargeModal } from "../../../../../componentsLoader/ComponentsLoader";

export default function RenderVisibleAssessments({
  darkMode,
  role,
  assessments,
  deleteAssessment,
  timeFilteration,
  currentDate,
  isUpComing,
}) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assessment?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAssessment(id);
      console.log("Assessment deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("Error deleting assessment.");
    }
  };

  const renderAssessments = () => {
    return assessments
      .filter(
        (assess) =>
          assess.time > timeFilteration.start_date &&
          assess.time < timeFilteration.end_date
      )
      .map((assess, index) => (
        <tr
          key={assess.id}
          className={`${assess.time === currentDate ? "alert-row" : ""}`}
        >
          <td>{index < 9 ? `0${index + 1}` : index + 1}</td>
          <td>
            <strong>{assess.name}</strong>
          </td>
          {role === "Admin" && <td>{assess.createdBy}</td>}
          <td title={`Start${isUpComing ? "" : "ed"} at: ${assess.start_time}`}>
            {assess.time}
          </td>
          <td>
            <span className="bg-label-success text-success me-1">
              {assess.questions.length}
            </span>
          </td>
          <td>
            <div className="d-flex gap-2 justify-content-center">
              <LargeModal
                goal={isUpComing ? "fa-user-plus" : "fa-eye"}
                darkMode={darkMode}
                isUpComing={isUpComing}
              />
              <Link
                to={`/assessment/${assess.id}`}
                className="btn btn-sm btn-outline-success"
                title="Edit"
              >
                <i className="fas fa-edit"></i>
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                title="Delete"
                onClick={() => handleDelete(assess.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      ));
  };

  return (
    <div
      className={`table-responsive text-nowrap ${
        darkMode ? "spic-dark-mode" : ""
      }`}
    >
      <table className={`table ${darkMode ? "table-dark " : "table-light"}`}>
        <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
          <tr>
            <th>#</th>
            <th>Title</th>
            {role === "Admin" && <th>Creator</th>}
            <th>Date</th>
            <th>Questions Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-border-bottom-0">{renderAssessments()}</tbody>
      </table>
    </div>
  );
}