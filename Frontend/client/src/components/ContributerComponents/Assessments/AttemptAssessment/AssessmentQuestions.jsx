import React, { useState, useEffect } from "react";
import {
  CodingQuestion,
  MultipleChoiceQuestion,
} from "../../../../componentsLoader/ComponentsLoader";

export default function AssessmentQuestions({
  user,
  darkMode,
  assessment,
  questions,
}) {
  //
  const [assessmentAttempt, setAssessmentAttempt] = useState({
    contributor_id: user.id,
    assessment_id: assessment.id,
    Answers: [],
    submitted: false,
    started_time: "",
    submitted_time: "",
  });

  //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  ///////
  function handleAttemptAttributes(e) {
    const { name, value } = e.target;
    setAssessmentAttempt((prevAttempt) => ({ ...prevAttempt, [name]: value }));
  }
  function addQuestionAnswer(option, question_id) {
    console.log("Adding/updating answer...");
    let updatedQuestionsAnswers = [...assessmentAttempt.Answers];

    // Find the index of the existing question in the answers array
    const index = updatedQuestionsAnswers.findIndex(
      (answer) => answer.question_id === question_id
    );

    if (index === -1) {
      // If the question_id does not exist, add a new entry
      updatedQuestionsAnswers.push({ question_id, contributor_answer: option });
      setAssessmentAttempt((prevAttempt) => ({
        ...prevAttempt,
        ["Answers"]: updatedQuestionsAnswers,
      }));
    } else {
      // If the question_id exists, update its answer
      updatedQuestionsAnswers[index].contributor_answer = option;
      setAssessmentAttempt((prevAttempt) => ({
        ...prevAttempt,
        ["Answers"]: updatedQuestionsAnswers,
      }));
    }
  }

  //
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  //
  const handleSubmitAssessment = () => {
    console.log("Submitted! ", assessmentAttempt);
  };

  /////////////
  useEffect(() => {
    console.log("Assessment Attempt: ", assessmentAttempt);
  }, [assessmentAttempt]);
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
          className={`px-5 py-4 card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          {questions[currentQuestionIndex].type === "mc" ? (
            <MultipleChoiceQuestion
              question={questions[currentQuestionIndex]}
              darkMode={darkMode}
              addQuestionAnswer={addQuestionAnswer}
            />
          ) : questions[currentQuestionIndex].type === "coding" ? (
            <CodingQuestion
              question={questions[currentQuestionIndex]}
              darkMode={darkMode}
              addQuestionAnswer={addQuestionAnswer}
            />
          ) : (
            <textarea
              className="w-100"
              rows={4}
              placeholder="Answer ..."
              onChange={(e) =>
                addQuestionAnswer(
                  e.target.value,
                  questions[currentQuestionIndex].id
                )
              }
            />
          )}
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
