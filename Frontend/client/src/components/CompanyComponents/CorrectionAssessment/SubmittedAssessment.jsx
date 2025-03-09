import React, { useState } from "react";
import CorrectionAssessment from "./CorrectionAssessment";

const SubmittedAssessment = () => {
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const attempts = [
    { attempt_id: "A1", contributor_id: "12345", assessment_id: "React101", submitted: true, submitted_date: "2025-02-13", status: "Pending Review" },
    { attempt_id: "A2", contributor_id: "54321", assessment_id: "JavaScript Advanced", submitted: true, submitted_date: "2025-02-12", status: "Reviewed" },
    { attempt_id: "A3", contributor_id: "67890", assessment_id: "CSS Basics", submitted: false, submitted_date: "N/A", status: "Not Submitted" },
  ];

  return (
    <div className="container my-5">
      {selectedAttempt ? (
        <CorrectionAssessment selectedAttempt={selectedAttempt} onGoBack={() => setSelectedAttempt(null)} />
      ) : (
        <>


          <div className="card shadow-sm p-4">
            <h1 className="text-center mb-4">Assessment Attempts</h1>
            <div className="table-responsive text-nowrap">

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Attempt ID</th>
                    <th>Contributor ID</th>
                    <th>Assessment</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.attempt_id}>
                      <td>{attempt.attempt_id}</td>
                      <td>{attempt.contributor_id}</td>
                      <td>{attempt.assessment_id}</td>
                      <td>{attempt.submitted ? attempt.submitted_date : "Not Submitted"}</td>
                      <td>
                        <span
                          className={`badge ${attempt.status === "Reviewed"
                              ? "bg-success"
                              : attempt.status === "Pending Review"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                        >
                          {attempt.status}
                        </span>
                      </td>
                      <td>
                        {attempt.submitted && attempt.status !== "Reviewed" ? (
                          <button
                            className="btn btn-primary btn-sm"
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
};

export default SubmittedAssessment;
