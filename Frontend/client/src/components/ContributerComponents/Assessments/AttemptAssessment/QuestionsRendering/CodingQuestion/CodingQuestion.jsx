import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { FilterableDropdown } from "../../../../../../componentsLoader/ComponentsLoader";

export default function CodingQuestion({
  darkMode,
  addQuestionAnswer,
  question,
}) {
  const [code, setCode] = useState("def solution():\n\n pass");
  const [isCodeEditting, setIsCodeEditting] = useState(true);
  const [language, setLanguage] = useState("python");
  const items = [
    { name: "Python", value: "python" },
    { name: "JavaScript", value: "javascript" },
  ];

  ///////////
  //
  function handleCodeUpdate(newValue) {
    setIsCodeEditting(true);
    setCode(newValue);
  }
  //
  function handleSaveCode() {
    addQuestionAnswer(code, question.id);
    setIsCodeEditting(false);
  }
  //
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
  }

  //////
  useEffect(() => {
    console.log("Coding Question: ", question);
  }, []);
  //////
  return (
    <>
      <div className="row overflow-xAxis">
        <div className="col-4 row border m-0">
          <div className="p-2 col-12">
            Description
            <hr className="m-0" />
          </div>

          <div className="col-12">
            <span className="">
              <strong>Examples:</strong>
            </span>
            <hr className="m-0" />
            <ul>
              {question.detailes.testCases.map((testCase, index) => {
                return (
                  <>
                    <li key={index} className="my-2">
                      Inputs:{" "}
                      <strong>
                        {testCase.inputs.map(
                          (input, i) =>
                            input +
                            (i === testCase.inputs.length - 1 ? "" : ", ")
                        )}
                      </strong>{" "}
                      - Excpected Output:{" "}
                      <strong>
                        {testCase.expectedOutput.map(
                          (out, i) =>
                            out +
                            (i === testCase.expectedOutput.length - 1
                              ? ""
                              : ", ")
                        )}
                      </strong>
                      .
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          style={{ backgroundColor: darkMode ? "#1E1E1E" : "#FFFF" }}
          className={`py-3 col-8 border row m-0 `}
        >
          <div className="col-12 col-md-4">
            <FilterableDropdown
              items={items}
              handleFunction={handleProgrammingLanguage}
              selectedValue={language}
              noExtraOption={true}
            />
          </div>
          <div className="col-12 my-4 p-0">
            <Editor
              height="400px"
              language="python"
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
          <div className="col-12 d-flex justify-content-center p-0">
            <button
              onClick={() => handleSaveCode()}
              className="btn btn-primary"
              disabled={!isCodeEditting}
            >
              Run & Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
