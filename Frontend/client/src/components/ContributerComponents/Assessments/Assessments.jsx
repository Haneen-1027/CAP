import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssessments } from "../../../APIs/ApisHandaler";
import "./Assessments.css";

export default function Assessments({ darkMode }) {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await getAllAssessments();
        const formattedAssessments = response.data.map(assessment => ({
          id: assessment.id,
          title: assessment.name,
          description: `Assessment with ${assessment.questionsCount} questions (Total marks: ${assessment.totalMark})`,
          time: assessment.duration,
          status: getAssessmentStatus(assessment.time, assessment.startTime, assessment.endTime),
          progress: 0, // You might want to calculate this based on user progress
          date: assessment.time,
          startTime: assessment.startTime,
          endTime: assessment.endTime
        }));
        setAssessments(formattedAssessments);
      } catch (err) {
        setError(err.message || "Failed to fetch assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const getAssessmentStatus = (date, startTime, endTime) => {
    const now = new Date();
    const assessmentDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (now < startDateTime) {
      return "Not Started";
    } else if (now >= startDateTime && now <= endDateTime) {
      return "In Progress";
    } else {
      return "Completed";
    }
  };

  const handleStartOrContinue = (id) => {
    navigate(`/contributer/assessments/${id}`);
  };

  if (loading) {
    return <div className="text-center my-5">Loading assessments...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  return (
    <div
      className={`container my-5 border abc ${darkMode ? " spic-dark-mode" : ""
        }`}
    >
      <h1 className="text-center mb-5 mt-4">Assessments</h1>
      <div className="row">
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <div key={assessment.id} className="col-md-6 col-lg-4 mb-4 ">
              <div className="card card1 h-100 shadow-sm">
                <div className={`card-body ${darkMode ? " spic-dark-mode" : ""}`}>
                  <h5 className="card-title">{assessment.title}</h5>
                  <p className="card-text">{assessment.description}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Duration:</span>
                    <span>{assessment.time}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Date:</span>
                    <span>{assessment.date}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Time:</span>
                    <span>{assessment.startTime} - {assessment.endTime}</span>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Status:</span>
                      <span
                        className={`badge ${assessment.status === "Completed"
                            ? "bg-success"
                            : assessment.status === "In Progress"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                      >
                        {assessment.status}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: "8px" }}>
                      <div
                        className={`progress-bar ${assessment.progress === 100
                            ? "bg-success"
                            : "bg-success"
                          }`}
                        role="progressbar"
                        style={{ width: `${assessment.progress}%` }}
                        aria-valuenow={assessment.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-success btn-sm"
                      disabled={assessment.status === "Completed"}
                      onClick={() => handleStartOrContinue(assessment.id)}
                    >
                      {assessment.status === "Not Started" ? "Start" : "Continue"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No assessments available.</p>
          </div>
        )}
      </div>
    </div>
  );
}