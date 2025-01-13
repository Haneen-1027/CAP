import React, { useState } from "react";
import "./Assessments.css";

export default function Assessments({ darkMode }) {
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            title: "React Basics Assessment",
            description: "Test your fundamental knowledge of React.",
            time:"90 min",
            status: "Completed",
            progress: 100,
        },
        {
            id: 2,
            title: "JavaScript Advanced Assessment",
            description: "Challenge yourself with advanced JavaScript questions.",
            time:"90 min",
            status: "In Progress",
            progress: 30,
        },
        {
            id: 3,
            title: "HTML & CSS Assessment",
            description: "Show your HTML and CSS skills.",
            time:"90 min",
            status: "Not Started",
            progress: 0,
        },
        {
            id: 4,
            title: "React Basics Assessment",
            description: "Test your fundamental knowledge of React.",
            time:"90 min",
            status: "Not Started",
            progress: 0,
        },
        {
            id: 5,
            title: "JavaScript Advanced Assessment",
            description: "Challenge yourself with advanced JavaScript questions.",
            time:"90 min",
            status: "In Progress",
            progress: 30,
        },
        {
            id: 6,
            title: "HTML & CSS Assessment",
            description: "Show your HTML and CSS skills.",
            time:"90 min",
            status: "In Progress",
            progress: 87,
        },
    ]);

    return (
        <div className={`container my-5 border abc ${darkMode ? " spic-dark-mode" : ""
            }`}>
            <h1 className="text-center mb-5 mt-4">Assessments</h1>
            <div className="row">
                {assessments.map((assessment) => (
                    <div key={assessment.id} className="col-md-6 col-lg-4 mb-4 ">
                        <div className="card card1 h-100 shadow-sm">
                            <div className={`card-body ${darkMode ? " spic-dark-mode" : ""
                                }`}>
                                <h5 className="card-title">{assessment.title}</h5>
                                <p className="card-text ">{assessment.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-bold">Time:</span>
                                    <span>{assessment.time}</span>
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
                                                : "bg-primary"
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
                                        className="btn btn-primary btn-sm"
                                        disabled={assessment.status === "Completed"}
                                    >
                                        {assessment.status === "Not Started" ? "Start" : "Continue"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
