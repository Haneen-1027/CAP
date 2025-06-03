import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CodingQuestion,
  MultipleChoiceQuestion,
} from "../../../../componentsLoader/ComponentsLoader";
import { submitAssessment, checkExistingSubmission } from "../../../../APIs/ApisHandaler";

const AssessmentQuestions = ({ user, darkMode, assessment, questions }) => {
  const navigate = useNavigate();
  const [assessmentAttempt, setAssessmentAttempt] = useState({
    assessment_id: assessment.id,
    user_id: user?.id || 0,
    Answers: [],
    submitted: false,
    started_time: new Date().toISOString(),
    submitted_time: "",
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSubmission, setIsCheckingSubmission] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Check for existing submission on server and client
  useEffect(() => {
    const checkSubmission = async () => {
      if (!user?.id) return;

      try {
        // First check server
        const serverResponse = await checkExistingSubmission(
          user.id,
          assessment.id
        );
        
        if (serverResponse.data?.submitted) {
          setAlreadySubmitted(true);
          navigate("/", {
            state: {
              message: "You have already submitted this assessment.",
              success: false,
            },
          });
          return;
        }

        // Then check localStorage as fallback
        const clientSubmitted = JSON.parse(
          localStorage.getItem(`user_${user.id}_submittedAssessments`) || '[]'
        ).includes(assessment.id);

        if (clientSubmitted) {
          setAlreadySubmitted(true);
          navigate("/", {
            state: {
              message: "You have already submitted this assessment.",
              success: false,
            },
          });
        }
      } catch (error) {
        console.error("Error checking submission:", error);
        // Continue with assessment if check fails
      } finally {
        setIsCheckingSubmission(false);
      }
    };

    checkSubmission();
  }, [assessment.id, navigate, user?.id]);

  // Calculate end time based on assessment duration
  const calculateEndTime = () => {
    const [hours, minutes] = assessment.duration.split(":");
    const durationInMs =
      (parseInt(hours) * 60 * 60 + parseInt(minutes) * 60) * 1000;
    return new Date(
      new Date(assessmentAttempt.started_time).getTime() + durationInMs
    );
  };

  // Check if time has expired
  useEffect(() => {
    if (alreadySubmitted) return;

    const endTime = calculateEndTime();
    const timer = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= endTime) {
        setTimeExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [assessmentAttempt.started_time, assessment.duration, alreadySubmitted]);

  // Handle time expiration
  useEffect(() => {
    if (timeExpired && !alreadySubmitted) {
      handleSubmitAssessment();
    }
  }, [timeExpired, alreadySubmitted]);

  const addQuestionAnswer = (answer, question_id) => {
    if (alreadySubmitted || timeExpired) return;

    let updatedQuestionsAnswers = [...assessmentAttempt.Answers];
    const index = updatedQuestionsAnswers.findIndex(
      (answer) => answer.question_id === question_id
    );

    const questionType =
      questions.find((q) => q.id === question_id)?.type || "essay";

    // For coding questions with test results
    if (typeof answer === "object" && answer.code !== undefined) {
      const { code, passedCount, totalTests } = answer;

      if (index === -1) {
        updatedQuestionsAnswers.push({
          question_id,
          contributor_answer: code,
          question_type: questionType,
          test_pass: passedCount,
          total_test_case: totalTests,
        });
      } else {
        updatedQuestionsAnswers[index] = {
          ...updatedQuestionsAnswers[index],
          contributor_answer: code,
          test_pass: passedCount,
          total_test_case: totalTests,
        };
      }
    }
    // For other question types
    else {
      if (index === -1) {
        updatedQuestionsAnswers.push({
          question_id,
          contributor_answer: answer,
          question_type: questionType,
        });
      } else {
        updatedQuestionsAnswers[index] = {
          ...updatedQuestionsAnswers[index],
          contributor_answer: answer,
        };
      }
    }

    setAssessmentAttempt((prevAttempt) => ({
      ...prevAttempt,
      Answers: updatedQuestionsAnswers,
    }));
  };

  const handleNext = () => {
    if (alreadySubmitted || timeExpired) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (alreadySubmitted || timeExpired) return;
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

const handleSubmitAssessment = async () => {
    if (alreadySubmitted) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userId = user?.id;
      if (!userId) throw new Error("User not found.");

      const finalAttempt = {
        assessment_id: parseInt(assessment.id.replace("Ass-", "")),
        user_id: userId,
        Answers: assessmentAttempt.Answers.map((answer) => ({
          question_id: parseInt(answer.question_id.toString().replace("Id", "")),
          contributor_answer: answer.contributor_answer,
          question_type: answer.question_type,
          ...(answer.question_type === "coding" && {
            test_pass: answer.test_pass || 0,
            total_test_case: answer.total_test_case ||
              questions.find((q) => q.id === answer.question_id)?.detailes?.testCases?.length || 0,
          }),
        })),
        submitted: true,
        started_time: assessmentAttempt.started_time,
        submitted_time: new Date().toISOString(),
      };

      // Server-side submission
      const response = await submitAssessment(finalAttempt);

      // Handle duplicate submission error
      if (response.status === 409) {
        setAlreadySubmitted(true);
        navigate("/", {
          state: {
            message: "You have already submitted this assessment.",
            success: false,
          },
        });
        return;
      }

      // Update client-side only after successful server submission
      const userSubmittedAssessments = JSON.parse(
        localStorage.getItem(`user_${userId}_submittedAssessments`) || '[]'
      );
      localStorage.setItem(
        `user_${userId}_submittedAssessments`,
        JSON.stringify([...userSubmittedAssessments, assessment.id])
      );

      navigate("/", {
        state: {
          message: timeExpired
            ? "Time has expired! Your assessment has been submitted."
            : "Assessment submitted successfully!",
          success: true,
        },
      });
    } catch (error) {
      console.error("Submission failed:", error);
      
      if (error.response?.status === 409) {
        setAlreadySubmitted(true);
        navigate("/", {
          state: {
            message: "You have already submitted this assessment.",
            success: false,
          },
        });
      } else {
        setSubmitError(
          error.response?.data?.message || "Failed to submit assessment. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSubmission) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (alreadySubmitted) {
    return null; // Or a loading spinner while redirecting
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion.id;

  const userAnswerObj = assessmentAttempt.Answers.find(
    (answer) => answer.question_id === currentQuestionId
  );
  const userAnswer = userAnswerObj ? userAnswerObj.contributor_answer : "";

  return (
    <>
      {timeExpired && (
        <div className="alert alert-warning text-center">
          Time has expired! Your assessment is being submitted...
        </div>
      )}

      {submitError && (
        <div className="alert alert-danger text-center">{submitError}</div>
      )}

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
              disabled={timeExpired}
            />
          ) : currentQuestion.type === "coding" ? (
            <CodingQuestion
              question={currentQuestion}
              darkMode={darkMode}
              addQuestionAnswer={(result) => {
                if (timeExpired) return;
                
                if (typeof result === "object" && result.code !== undefined) {
                  addQuestionAnswer(
                    {
                      code: result.code,
                      passedCount: result.passedCount,
                      totalTests: result.totalTests,
                    },
                    currentQuestionId
                  );
                } else {
                  addQuestionAnswer(result, currentQuestionId);
                }
              }}
              userAnswer={userAnswer}
              disabled={timeExpired}
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
              disabled={timeExpired}
            />
          )}
        </div>

        <div
          className={`p-2 d-flex justify-content-between card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
          }`}
        >
          <button
            style={{ width: "10rem" }}
            className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting || timeExpired}
          >
            Previous
          </button>
          {currentQuestionIndex + 1 === questions.length ? (
            <button
              style={{ width: "10rem" }}
              className="btn btn-success"
              onClick={handleSubmitAssessment}
              disabled={timeExpired || isSubmitting || alreadySubmitted}
            >
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
              onClick={handleNext}
              disabled={timeExpired || isSubmitting || alreadySubmitted}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AssessmentQuestions;