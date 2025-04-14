import React, { useState } from "react";
import CorrectionAssessment from "./CorrectionAssessment";

function SubmittedAssessment({ darkMode }) {
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const attempts = [
    {
      attempt_id: "1",
      contributor_id: "12345",
      assessment_id: "React101",
      submitted: true,
      submitted_date: "2025-02-13",
      status: "Pending Review",
    },
    {
      attempt_id: "2",
      contributor_id: "54321",
      assessment_id: "JavaScript Advanced",
      submitted: true,
      submitted_date: "2025-02-12",
      status: "Reviewed",
    },
    {
      attempt_id: "3",
      contributor_id: "67890",
      assessment_id: "CSS Basics",
      submitted: false,
      submitted_date: "N/A",
      status: "Not Submitted",
    },
  ];

  return (
    <div className="container my-5 ">
      {selectedAttempt ? (
        <CorrectionAssessment
          selectedAttempt={selectedAttempt}
          darkMode={darkMode}
          onGoBack={() => setSelectedAttempt(null)}
        />
      ) : (
        <>
          <div
            className={`card shadow-sm p-4 ${
              darkMode ? "spic-dark-mode border-light" : ""
            }`}
          >
            <h1 className="text-center mb-4">Assessment Attempts</h1>
            <div
              className={`table-responsive text-nowrap ${
                darkMode ? "spic-dark-mode border-light" : ""
              }`}
            >
              <table
                className={`table table-bordered ${
                  darkMode ? "spic-dark-mode border-light" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>#</th>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>
                      Contributor ID
                    </th>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>
                      Assessment
                    </th>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>
                      Submitted
                    </th>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>
                      Status
                    </th>
                    <th className={`${darkMode ? "spic-dark-mode" : ""}`}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.attempt_id}>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        {attempt.attempt_id}
                      </td>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        {attempt.contributor_id}
                      </td>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        {attempt.assessment_id}
                      </td>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        {attempt.submitted
                          ? attempt.submitted_date
                          : "Not Submitted"}
                      </td>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        <span
                          className={`badge ${
                            attempt.status === "Reviewed"
                              ? "bg-success"
                              : attempt.status === "Pending Review"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </td>
                      <td className={`${darkMode ? "spic-dark-mode" : ""}`}>
                        {attempt.submitted && attempt.status !== "Reviewed" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => setSelectedAttempt(attempt)}
                          >
                            Review
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm" disabled>
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SubmittedAssessment;
