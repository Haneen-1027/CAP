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
  const [assessmentAttempt, setAssessmentAttempt] = useState({
    contributor_id: user.id,
    assessment_id: assessment.id,
    Answers: [],
    submitted: false,
    started_time: new Date().toISOString(), // Set current time as started time
    submitted_time: "",
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  function handleAttemptAttributes(e) {
    const { name, value } = e.target;
    setAssessmentAttempt((prevAttempt) => ({ ...prevAttempt, [name]: value }));
  }

  function addQuestionAnswer(answer, question_id) {
    let updatedQuestionsAnswers = [...assessmentAttempt.Answers];
    const index = updatedQuestionsAnswers.findIndex(
      (answer) => answer.question_id === question_id
    );

    if (index === -1) {
      updatedQuestionsAnswers.push({ 
        question_id, 
        contributor_answer: answer,
        question_type: questions.find(q => q.id === question_id)?.type || 'essay'
      });
    } else {
      updatedQuestionsAnswers[index].contributor_answer = answer;
    }

    setAssessmentAttempt((prevAttempt) => ({
      ...prevAttempt,
      Answers: updatedQuestionsAnswers,
    }));
  }

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

  const handleSubmitAssessment = () => {
    const finalAttempt = {
      ...assessmentAttempt,
      submitted: true,
      submitted_time: new Date().toISOString()
    };
    console.log("Submitted! ", finalAttempt);
    // Here we send the attempt to backend API
  };

  useEffect(() => {
    console.log("Assessment Attempt: ", assessmentAttempt);
  }, [assessmentAttempt]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion.id;

  const userAnswerObj = assessmentAttempt.Answers.find(
    (answer) => answer.question_id === currentQuestionId
  );
  const userAnswer = userAnswerObj ? userAnswerObj.contributor_answer : "";

  return (
    <>
      <div className={`card ${darkMode ? "spic-dark-mode border-light" : ""}`}>
        <div
          className={`px-2 py-3 card-header d-flex flex-column flex-md-row gap-4 align-md-center ${
            darkMode ? "border-light" : ""
          }`}
        >
          <div>
            <p className={`${darkMode ? "text-light" : "text-muted"} m-0`}>
              <strong>Question #{currentQuestionIndex + 1}:</strong>
              <span className="ms-2 badge bg-primary">
                {currentQuestion.mark} marks
              </span>
            </p>
          </div>
          <div>
            <p className="h5 m-0">
              <strong>{currentQuestion.prompt}</strong>
            </p>
          </div>
        </div>

        <div
          className={`px-5 py-4 card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          {currentQuestion.type === "mc" ? (
            <MultipleChoiceQuestion
              question={currentQuestion}
              darkMode={darkMode}
              addQuestionAnswer={addQuestionAnswer}
              userAnswer={userAnswer}
            />
          ) : currentQuestion.type === "coding" ? (
            <CodingQuestion
              question={currentQuestion}
              darkMode={darkMode}
              addQuestionAnswer={addQuestionAnswer}
              userAnswer={userAnswer}
            />
          ) : (
            <textarea
              className={`form-control ${darkMode ? "bg-dark text-light" : ""}`}
              rows={4}
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) =>
                addQuestionAnswer(e.target.value, currentQuestionId)
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
            className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex + 1 === questions.length ? (
            <button
              style={{ width: "6rem" }}
              className="btn btn-success"
              onClick={handleSubmitAssessment}
            >
              Submit
            </button>
          ) : (
            <button
              style={{ width: "6rem" }}
              className={`btn ${darkMode ? "btn-light" : "btn-primary"}`}
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}