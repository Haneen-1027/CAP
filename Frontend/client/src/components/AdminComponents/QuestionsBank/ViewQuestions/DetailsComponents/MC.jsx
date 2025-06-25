import React, { useEffect } from "react";

export default function MC({ details, darkMode }) {
  useEffect(() => {
    console.log("details: ", details);
  }, [details]);

  const { correctAnswer, wrongOptions, isTrueFalse } = details;

  const containerStyle = {
    backgroundColor: darkMode ? "#343a40" : "#ffffff",
    color: darkMode ? "#f8f9fa" : "#212529",
    padding: "1.5rem",
    borderRadius: "0.75rem",
  };

  return (
    <div className="container my-4" style={containerStyle}>
      <div className="mb-3">
        <strong>Correct Answer:</strong>
        <div className="alert alert-success mt-2 p-2">{correctAnswer[0]}</div>
      </div>

      <div className="mb-3">
        <strong>Wrong Options:</strong>
        <ul className="list-group mt-2">
          {wrongOptions.map((opt, index) => (
            <li className="list-group-item" key={index}>
              {opt}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Type:</strong>{" "}
        <span className="badge bg-secondary">
          {isTrueFalse ? "True/False" : "Regular Multiple Choice"}
        </span>
      </div>
    </div>
  );
}
