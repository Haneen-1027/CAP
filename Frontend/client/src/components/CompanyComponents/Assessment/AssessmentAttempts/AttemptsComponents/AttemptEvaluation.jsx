import React, { useEffect, useState } from "react";
import {
  BackBtn,
  CodingReview,
  MultipleChoiceReview,
} from "../../../../../componentsLoader/ComponentsLoader";
import { useParams } from "react-router";
import attempts from "../Attempts.json";

export default function AttemptEvaluation({ darkMode }) {
  //
  const { attempt_id } = useParams();

  const [attempt, setAttempt] = useState({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle Next
  const handleNext = () => {
    if (currentQuestionIndex < attempt.Answers.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handle Previous
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle Updating Marks
  const handleUpdatingMarks = (newValue, question_id) => {
    // Ensure that the new Value between 0 (min value) and total question mark (max value)
    if (newValue < 0) newValue = 0;
    else if (newValue > attempt.Answers[currentQuestionIndex].total_mark)
      newValue = attempt.Answers[currentQuestionIndex].total_mark;

    // Update the attempt state
    setAttempt((prevAttempt) => ({
      ...prevAttempt,
      Answers: prevAttempt.Answers.map((question, index) =>
        question.question_id == question_id
          ? { ...question, new_mark: parseInt(newValue) }
          : question
      ),
    }));
  };

  //////////////////////////////
  useEffect(() => {
    const user_attempt = attempts[attempt_id];
    setAttempt(user_attempt);
  }, []);
  useEffect(() => {
    console.log("User Attempt: ", attempt);
  }, [attempt]);
  //////////////////////////////
  if (Object.keys(attempt).length !== 0)
    return (
      <>
        <BackBtn />
        <div
          className={`card my-4 ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          <div
            className={`p-4 card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center ${
              darkMode ? "border-light" : ""
            }`}
          >
            {/** Question General details */}
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
              <div>
                <p className={`${darkMode ? "text-light" : "text-muted"} m-0`}>
                  <strong className="">Question #1:</strong>
                </p>
              </div>
              <div style={{ maxWidth: "36rem" }} className="mt-2 mb-4 m-md-0">
                <p className="h5 m-0">
                  <strong>
                    {attempt.Answers[currentQuestionIndex].prompt}
                  </strong>
                </p>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="form-floating" style={{ width: "" }}>
                <input
                  className="form-control"
                  type="number"
                  value={attempt.Answers[currentQuestionIndex].new_mark}
                  onChange={(e) =>
                    handleUpdatingMarks(
                      e.target.value,
                      attempt.Answers[currentQuestionIndex].question_id
                    )
                  }
                />
                <label
                  style={{ color: `${darkMode ? "#ccc" : ""}` }}
                  htmlFor="earned_mark"
                >
                  Mark Earned:
                </label>
              </div>
              <span className="mx-2">/</span>
              <span className="badge bg-success p-2">
                {attempt.Answers[currentQuestionIndex].total_mark} marks
              </span>
            </div>
          </div>
          {/** Answer Section */}
          <div
            className={`p-4 card-header d-flex flex-column flex-md-row gap-3 align-md-center ${
              darkMode ? "border-light" : ""
            }`}
          >
            {attempt.Answers[currentQuestionIndex].question_details
              .question_type === "mc" ? (
              <MultipleChoiceReview
                isTrueFalse={
                  attempt.Answers[currentQuestionIndex].question_details
                    .is_true_false
                }
                visiplOptions={
                  attempt.Answers[currentQuestionIndex].question_details
                    .visible_options
                }
                user_answer={
                  attempt.Answers[currentQuestionIndex].contributor_answer
                }
                id={attempt.Answers[currentQuestionIndex].question_id}
                darkMode={darkMode}
              />
            ) : attempt.Answers[currentQuestionIndex].question_details
                .question_type === "coding" ? (
              <CodingReview />
            ) : attempt.Answers[currentQuestionIndex].question_details
                .question_type === "essay" ? (
              <textarea
                className={`form-control ${
                  darkMode ? "bg-dark text-light" : ""
                }`}
                rows={4}
                value={attempt.Answers[currentQuestionIndex].contributor_answer}
                disabled
              />
            ) : (
              <div className="alert alert-danger">
                This Question is Not Supported!
              </div>
            )}
          </div>

          {/** Last Section (Buttons) */}
          <div
            className={`d-flex justify-content-between card-header ${
              darkMode ? "spic-dark-mode border-light" : ""
            }`}
          >
            <button
              style={{ width: "10rem" }}
              className={`btn  ${darkMode ? "btn-light" : "btn-dark"}`}
              disabled={currentQuestionIndex === 0}
              onClick={() => handlePrevious()}
            >
              Previous
            </button>
            {currentQuestionIndex + 1 === 10 ? (
              <button style={{ width: "10rem" }} className="btn btn-success">
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            ) : (
              <button
                style={{ width: "10rem" }}
                className={`btn ${darkMode ? "btn-light" : "btn-primary"}`}
                onClick={() => handleNext()}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </>
    );
  else return <div>Loading ...</div>;
}
