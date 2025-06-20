import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FilterableDropdown } from "../../../../../../componentsLoader/ComponentsLoader";
import { executeCode } from "../../../../../../APIs/ApisHandaler";
import Swal from "sweetalert2";

export default function CodingQuestion({
  darkMode,
  addQuestionAnswer,
  question,
  userAnswer,
}) {
  const [code, setCode] = useState("def solution():\n\n pass");
  const [isCodeEditting, setIsCodeEditting] = useState(true);
  const [language, setLanguage] = useState("python");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isDescriptionToggled, setIsDescriptionToggled] = useState(false);

  const languageIds = {
    python: 71,
    javascript: 63,
  };

  const items = [
    { name: "Python", value: "python" },
    { name: "JavaScript", value: "javascript" },
  ];

  function handleCodeUpdate(newValue) {
    setIsCodeEditting(true);
    setCode(newValue);
  }

  async function handleRunAndSave() {
    if (!code.trim()) {
      Swal.fire("Error", "Please write some code before running", "error");
      return;
    }

    setIsRunning(true);
    try {
      const questionId = question.id.replace(/^Id/, "");
      const response = await executeCode(
        questionId,
        code,
        languageIds[language]
      );
      const results = response.data;
      setTestResults(results);

      // Calculate passed test cases
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

      // Call addQuestionAnswer with the test results
      addQuestionAnswer({
        code,
        passedCount,
        totalTests,
      });
    } catch (error) {
      console.error("Error executing code:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to execute code",
        "error"
      );

      // Call addQuestionAnswer with default values if there's an error
      addQuestionAnswer({
        code,
        passedCount: 0,
        totalTests: question.detailes.testCases.length,
      });
    } finally {
      setIsRunning(false);
    }
  }

  function handleProgrammingLanguage(e) {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    let code = "";
    if (selectedLanguage === "python") {
      code = "def solution():\n    pass";
    } else if (selectedLanguage === "javascript") {
      code = "function solution() {\n    return;\n}";
    } else {
      code = "Error!!!";
    }

    setCode(code);
    setIsCodeEditting(true);
  }

  useEffect(() => {
    if (userAnswer) {
      setCode(userAnswer);
    }
  }, [userAnswer]);

  return (
    <>
      <div className="row overflow-xAxis">
        <button
          className="btn btn-primary mb-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#descriptionPanel"
          aria-expanded="true"
          aria-controls="descriptionPanel"
          onClick={() => setIsDescriptionToggled(!isDescriptionToggled)}
        >
          Toggle Description Panel
        </button>
        <div
          className="col-4 row border m-0 collapse show"
          id="descriptionPanel"
        >
          <div className="p-2 col-12">
            <span className="">
              <strong>Description:</strong>
            </span>
            <hr className="mt-0 mb-4" />
            {question.detailes.description
              ? question.detailes.description
              : "Old Question: Description is not supported!"}
          </div>

          <div className="col-12">
            <span className="">
              <strong>Examples:</strong>
            </span>
            <hr className="m-0" />
            <ul>
              {question.detailes.testCases.map((testCase, index) => {
                if (index < 2) {
                  return (
                    <li key={index} className="my-2">
                      Inputs:{" "}
                      <strong>
                        {testCase.inputs.map(
                          (input, i) =>
                            input +
                            (i === testCase.inputs.length - 1 ? "" : ", ")
                        )}
                      </strong>{" "}
                      - Expected Output:{" "}
                      <strong>{testCase.expectedOutput}</strong>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>

        <div
          style={{ backgroundColor: darkMode ? "#1E1E1E" : "#FFFF" }}
          className={`py-3 ${
            isDescriptionToggled ? "col-12" : "col-8"
          }  border row m-0`}
        >
          <div className="col-12 col-md-4 m-0">
            <FilterableDropdown
              darkMode={darkMode}
              items={items}
              handleFunction={handleProgrammingLanguage}
              selectedValue={language}
              noExtraOption={true}
            />
          </div>

          <div className="col-12 my-2">
            <hr className="m-0 my-2" />

            <div>
              <Editor
                height="400px"
                language={language}
                theme={darkMode ? "vs-dark" : "vs-light"}
                value={code}
                onChange={(newValue) => handleCodeUpdate(newValue)}
                options={{
                  overviewRulerLanes: 0,
                  fontSize: 14,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {/* Test Results Section */}
          {testResults.length > 0 && (
            <div className="col-12 mt-3">
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
                        <td>{test.inputs.join(", ")}</td>
                        <td>{test.expectedOutput}</td>
                        <td>
                          {test.error ? (
                            <span className="text-danger">{test.error}</span>
                          ) : (
                            test.actualOutput
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

          <div className="col-12 d-flex justify-content-center p-0 mt-3">
            <button
              onClick={handleRunAndSave}
              className="btn btn-success"
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Running...
                </>
              ) : (
                "Run & Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
