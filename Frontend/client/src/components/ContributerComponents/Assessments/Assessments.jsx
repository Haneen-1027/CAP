import React, { useState } from "react";
import "./Assessments.css";

export default function ProfilePage() {
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            title: "React Basics Assessment",
            description: "Test your fundamental knowledge of React.",
            status: "Completed",
            progress: 100,
        },
        {
            id: 2,
            title: "JavaScript Advanced Assessment",
            description: "Challenge yourself with advanced JavaScript questions.",
            status: "In Progress",
            progress: 30,
        },
        {
            id: 3,
            title: "HTML & CSS Assessment",
            description: "Show your HTML and CSS skills.",
            status: "Not Started",
            progress: 0,
        },
    ]);

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Assessments</h1>
            <div className="row">
                {assessments.map((assessment) => (
                    <div key={assessment.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{assessment.title}</h5>
                                <p className="card-text text-muted">{assessment.description}</p>
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
