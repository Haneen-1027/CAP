import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  BackBtn,
  MultipleChoiceReview,
  FilterableDropdown,
} from "../../../../../componentsLoader/ComponentsLoader";
import { useParams, useNavigate } from "react-router";
import {
  getAttempts,
  executeCode,
  updateSubmissionMark,
} from "../../../../../APIs/ApisHandaler";
import Swal from "sweetalert2";

export default function AttemptEvaluation({ darkMode }) {
  const { assessment_id, attempt_id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [code, setCode] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] = useState(71); // Default to Python

  const navigate = useNavigate();

  // Language mapping with templates
  const languageMap = {
    51: { 
      monaco: "csharp", 
      name: "C#", 
      template: "// Update function type if needed\n\nobject solution() {\n  return null;\n}" 
    },
    54: { 
      monaco: "cpp", 
      name: "C++", 
      template: "// Update function type if needed\n\nvoid solution() {\n  return;\n}" 
    },
    60: { 
      monaco: "go", 
      name: "Go", 
      template: "func solution() interface{} {\n  return nil\n}" 
    },
    71: { 
      monaco: "python", 
      name: "Python", 
      template: "def solution():\n  pass" 
    },
    63: { 
      monaco: "javascript", 
      name: "JavaScript", 
      template: "function solution() {\n  return;\n}" 
    },
    74: { 
      monaco: "typescript", 
      name: "TypeScript", 
      template: "function solution(): any {\n  return;\n}" 
    },
  };

  // Language dropdown items
  const languageItems = [
    { name: "Python", value: 71 },
    { name: "JavaScript", value: 63 },
    { name: "TypeScript", value: 74 },
    { name: "C#", value: 51 },
    { name: "C++", value: 54 },
    { name: "Go", value: 60 },
  ];

  // Fetch attempt data
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await getAttempts(assessment_id);
        if (response.status === 200 && Array.isArray(response.data)) {
          const selectedAttempt = response.data[attempt_id];
          if (selectedAttempt) {
            setAttempt({
              ...selectedAttempt,
              Answers: selectedAttempt.answers.map((answer) => ({
                ...answer,
                total_mark: answer.total_mark || answer.new_mark,
                new_mark: answer.new_mark || 0,
              })),
            });
            // Set initial code and language for coding questions
            if (
              selectedAttempt.answers[0]?.question_details?.question_type === "coding"
            ) {
              const langId = selectedAttempt.answers[0].question_details.used_langauage;
              setCode(selectedAttempt.answers[0].contributor_answer);
              setSelectedLanguageId(langId);
            }
          } else {
            setError("Attempt not found");
          }
        } else {
          setError("Invalid response from server");
        }
      } catch (err) {
        setError("Failed to fetch attempt data");
        console.error("Error fetching attempt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [assessment_id, attempt_id]);

  // Update code when question changes
  useEffect(() => {
    if (
      attempt &&
      attempt.Answers[currentQuestionIndex]?.question_details?.question_type === "coding"
    ) {
      const langId = attempt.Answers[currentQuestionIndex].question_details.used_langauage;
      setCode(attempt.Answers[currentQuestionIndex].contributor_answer);
      setSelectedLanguageId(langId);
    }
  }, [currentQuestionIndex, attempt]);

  const saveCurrentQuestionMark = async (showSuccess = false) => {
    if (!attempt) return false;

    const currentQuestion = attempt.Answers[currentQuestionIndex];
    if (currentQuestion.new_mark === undefined) return false;

    try {
      setIsSubmitting(true);
      const response = await updateSubmissionMark(
        attempt.user_id,
        assessment_id,
        currentQuestion.question_id,
        currentQuestion.new_mark
      );

      if (response.success) {
        setAttempt((prevAttempt) => ({
          ...prevAttempt,
          Answers: prevAttempt.Answers.map((q) =>
            q.question_id === currentQuestion.question_id
              ? { ...q, total_mark: response.updatedMark }
              : q
          ),
        }));
        if (showSuccess) {
          Swal.fire("Saved!", "Mark has been saved successfully.", "success");
        }
        return true;
      }
    } catch (error) {
      console.error("Error updating mark:", error);
      Swal.fire("Error", "Failed to update mark", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const handleNext = async () => {
    if (!attempt || currentQuestionIndex >= attempt.Answers.length - 1) return;

    const saved = await saveCurrentQuestionMark();

    if (
      saved ||
      attempt.Answers[currentQuestionIndex].new_mark ===
        attempt.Answers[currentQuestionIndex].total_mark
    ) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTestResults([]);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex <= 0) return;

    const saved = await saveCurrentQuestionMark();

    if (
      saved ||
      attempt.Answers[currentQuestionIndex].new_mark ===
        attempt.Answers[currentQuestionIndex].total_mark
    ) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setTestResults([]);
    }
  };

  const handleUpdatingMarks = (newValue, question_id) => {
    if (!attempt) return;

    const currentQuestion = attempt.Answers[currentQuestionIndex];
    if (newValue < 0) newValue = 0;
    else if (newValue > currentQuestion.total_mark)
      newValue = currentQuestion.total_mark;

    setAttempt((prevAttempt) => ({
      ...prevAttempt,
      Answers: prevAttempt.Answers.map((question) =>
        question.question_id == question_id
          ? { ...question, new_mark: parseInt(newValue) }
          : question
      ),
    }));
  };

  const handleNewEvaluation = async () => {
    const saved = await saveCurrentQuestionMark(true);

    if (saved) {
      Swal.fire(
        "Submitted!",
        "Evaluation has been submitted successfully.",
        "success"
      ).then(() => {
        navigate(`/attempts/${assessment_id}`);
      });
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      Swal.fire("Error", "Please write some code before running", "error");
      return;
    }

    setIsRunning(true);
    try {
      const currentQuestion = attempt.Answers[currentQuestionIndex];
      const response = await executeCode(
        currentQuestion.question_id,
        code,
        selectedLanguageId // Use the currently selected language
      );

      const results = response.data;
      setTestResults(results);

      const passedCount = results.filter(
        (test) => test.actualOutput === test.expectedOutput && !test.error
      ).length;
      const totalTests = results.length;

      if (passedCount === totalTests) {
        Swal.fire("Success", "All test cases passed!", "success");
      } else {
        Swal.fire(
          "Test Results",
          `Passed ${passedCount} of ${totalTests} test cases`,
          passedCount > 0 ? "warning" : "error"
        );
      }
    } catch (error) {
      console.error("Error executing code:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to execute code",
        "error"
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleLanguageChange = (e) => {
    const newLanguageId = parseInt(e.target.value);
    setSelectedLanguageId(newLanguageId);
    
    // Only update the code if it's the default template
    const currentTemplate = languageMap[selectedLanguageId]?.template || "";
    if (code.trim() === currentTemplate.trim()) {
      setCode(languageMap[newLanguageId]?.template || "");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-4">
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger my-4">Error: {error}</div>;
  }

  if (!attempt) {
    return (
      <div className="alert alert-warning my-4">No attempt data found</div>
    );
  }

  const currentQuestion = attempt.Answers[currentQuestionIndex];
  const isCodingQuestion =
    currentQuestion?.question_details?.question_type === "coding";
  const editorLanguage = languageMap[selectedLanguageId]?.monaco || "python";
  const languageName = languageMap[selectedLanguageId]?.name || "Unknown";

  return (
    <>
      <BackBtn />
      <div className={`card my-4 ${darkMode ? "spic-dark-mode border-light" : ""}`}>
        <div className={`p-4 card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center ${
          darkMode ? "border-light" : ""
        }`}>
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
            <div>
              <p className={`${darkMode ? "text-light" : "text-muted"} m-0`}>
                <strong className="">
                  Question #
                  {currentQuestionIndex < 10
                    ? "0" + (currentQuestionIndex + 1)
                    : currentQuestionIndex}
                  :
                </strong>
              </p>
            </div>
            <div style={{ maxWidth: "36rem" }} className="mt-2 mb-4 m-md-0">
              <p className="h5 m-0">
                <strong>{currentQuestion.prompt}</strong>
              </p>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-center">
            <div className="form-floating">
              <input
                className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
                type="number"
                value={currentQuestion.new_mark}
                onChange={(e) =>
                  handleUpdatingMarks(
                    e.target.value,
                    currentQuestion.question_id
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
              {currentQuestion.total_mark} marks
            </span>
          </div>
        </div>

        <div className={`p-4 card-header d-flex flex-column flex-md-row gap-3 align-md-center ${
          darkMode ? "border-light" : ""
        }`}>
          {currentQuestion.question_details?.question_type === "mc" ? (
            <MultipleChoiceReview
              isTrueFalse={
                currentQuestion.question_details?.is_true_false || false
              }
              visiplOptions={
                currentQuestion.question_details?.visible_options || []
              }
              user_answer={currentQuestion.contributor_answer}
              id={currentQuestion.question_id}
              darkMode={darkMode}
            />
          ) : isCodingQuestion ? (
            <div className="w-100">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ minWidth: "150px" }}>
                    <FilterableDropdown
                      darkMode={darkMode}
                      items={languageItems}
                      handleFunction={handleLanguageChange}
                      selectedValue={selectedLanguageId}
                      noExtraOption={true}
                    />
                  </div>
                  <span>Code Solution:</span>
                </div>
                <button
                  onClick={handleRunCode}
                  className="btn btn-sm btn-success"
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Running...
                    </>
                  ) : (
                    "Run Code"
                  )}
                </button>
              </div>
              <Editor
                height="400px"
                language={editorLanguage}
                theme={darkMode ? "vs-dark" : "vs-light"}
                value={code}
                onChange={handleCodeChange}
                options={{
                  readOnly: true,
                  overviewRulerLanes: 0,
                  fontSize: 14,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />

              {testResults.length > 0 && (
                <div className="mt-3">
                  <h5>Test Results:</h5>
                  <div className="table-responsive">
                    <table className={`table ${darkMode ? "table-dark" : ""}`}>
                      <thead>
                        <tr>
                          <th>Input</th>
                          <th>Expected</th>
                          <th>Your Output</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.map((test, index) => (
                          <tr key={index}>
                            <td>{test.inputs?.join(", ") || "N/A"}</td>
                            <td>{test.expectedOutput || "N/A"}</td>
                            <td>
                              {test.error ? (
                                <span className="text-danger">
                                  {test.error}
                                </span>
                              ) : (
                                test.actualOutput || "N/A"
                              )}
                            </td>
                            <td>
                              {test.error ? (
                                <span className="text-danger">❌ Error</span>
                              ) : test.actualOutput === test.expectedOutput ? (
                                <span className="text-success">✓ Passed</span>
                              ) : (
                                <span className="text-warning">✗ Failed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : currentQuestion.question_details?.question_type === "essay" ? (
            <textarea
              className={`form-control ${darkMode ? "bg-dark text-light" : ""}`}
              rows={4}
              value={currentQuestion.contributor_answer}
              disabled
            />
          ) : (
            <div className="alert alert-danger">
              This Question is Not Supported!
            </div>
          )}
        </div>

        <div className={`d-flex justify-content-between card-header ${
          darkMode ? "spic-dark-mode border-light" : ""
        }`}>
          <button
            style={{ width: "10rem" }}
            className={`btn btn-dark`}
            disabled={currentQuestionIndex === 0}
            onClick={() => handlePrevious()}
          >
            Previous
          </button>
          {currentQuestionIndex + 1 === attempt.Answers.length ? (
            <button
              style={{ width: "10rem" }}
              className="btn btn-success"
              onClick={() => handleNewEvaluation()}
              disabled={isSubmitting}
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
              className={`btn ${darkMode ? "btn-light" : "btn-success"}`}
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