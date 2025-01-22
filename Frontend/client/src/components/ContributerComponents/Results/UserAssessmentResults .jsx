import React, { useState } from "react";
import "./UserAssessmentResults.css";

const UserAssessmentResults = ({ darkMode }) => {
    const [assessments] = useState([
        {
            id: 1,
            title: "React Basics Assessment",
            status: "Not Started",
            score: null,
            max_score: 10,
        },
        {
            id: 2,
            title: "JavaScript Advanced Assessment",
            status: "In Progress",
            score: null,
            max_score: 15,
        },
        {
            id: 3,
            title: "HTML & CSS Assessment",
            status: "Corrected",
            score: 8,
            max_score: 10,
        },
        {
            id: 4,
            title: "React Advance Assessment",
            status: "Not Started",
            score: null,
            max_score: 10,
        },
        {
            id: 5,
            title: "JavaScript Assessment",
            status: "Corrected",
            score: 6,
            max_score: 15,
        },
        {
            id: 6,
            title: "CSS Assessment",
            status: "Corrected",
            score: 8,
            max_score: 10,
        },
    ]);

    return (
        <div className={` ${darkMode ? "assessment-results-container-dark" : "assessment-results-container"}`}>
            <h1 className={` ${darkMode ? "assessment-results-title-dark" : "assessment-results-title"}`}>
                User Assessment Results
            </h1>

            <div className="table-responsive">
                <table className={`table  ${darkMode ? "assessment-results-table-dark" : "assessment-results-table"}`}>
                    <thead className={` ${darkMode ? "assessment-results-header-dark" : "assessment-results-header"}`}>
                        <tr>
                            <th className={`text-center`}>#</th>
                            <th className={`text-center`}>Title</th>
                            <th className={`text-center`}>Status</th>
                            <th className={`text-center`}>Score</th>
                            <th className={`text-center`}>Total Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map((assessment) => (
                            <tr key={assessment.id}>
                                <td>{assessment.id}</td>
                                <td className={` ${darkMode ? "assessment-title-dark" : "assessment-title"}`}>
                                    {assessment.title}
                                </td>
                                <td>
                                    <span
                                        className={`badge  ${darkMode ? "assessment-status-badge-dark" : "assessment-status-badge"} ${
                                            assessment.status === "Not Started"
                                                ? "badge-not-started"
                                                : assessment.status === "In Progress"
                                                ? "badge-in-progress"
                                                : "badge-corrected"
                                        }`}
                                    >
                                        {assessment.status}
                                    </span>
                                </td>
                                <td className={` ${darkMode ? "assessment-score-dark" : "assessment-score"}`}>
                                    {assessment.score !== null
                                        ? `${assessment.score} / ${assessment.max_score}`
                                        : "-"}
                                </td>
                                <td>{assessment.max_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAssessmentResults;
