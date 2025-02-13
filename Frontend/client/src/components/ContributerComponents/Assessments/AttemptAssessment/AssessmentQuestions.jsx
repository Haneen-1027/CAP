import React, { useState, useEffect } from "react";

export default function AssessmentQuestions({ darkMode, questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  ///////
  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    setSelectedOption(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmitAssessment = () => {
    console.log("Submitted!");
  };

  //////////////
  return (
    <>
      <div className={`card ${darkMode ? "spic-dark-mode border-light" : ""}`}>
        <div
          className={` px-2 py-3 card-header d-flex flex-column flex-md-row gap-4 align-md-center ${
            darkMode ? "border-light" : ""
          }`}
        >
          <div className="">
            <p className={`${darkMode ? "text-light" : "text-muted"} m-0`}>
              <strong>Question #{currentQuestionIndex + 1}:</strong>
            </p>
          </div>
          <div className="">
            <p className="h5 m-0">
              <strong>{questions[currentQuestionIndex].prompt}</strong>
            </p>
          </div>
        </div>
        <div
          className={`px-2 py-4 card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          {questions[currentQuestionIndex].type}
        </div>
        <div
          className={`p-2 d-flex justify-content-between card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          <button
            style={{ width: "6rem" }}
            className="btn btn-dark"
            onClick={() => handlePrevious()}
          >
            Previous
          </button>
          {currentQuestionIndex + 1 === questions.length ? (
            <button
              style={{ width: "6rem" }}
              className="btn btn-primary"
              onClick={() => handleSubmitAssessment()}
            >
              Submit
            </button>
          ) : (
            <button
              style={{ width: "6rem" }}
              className="btn btn-primary"
              onClick={() => handleNext()}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}
