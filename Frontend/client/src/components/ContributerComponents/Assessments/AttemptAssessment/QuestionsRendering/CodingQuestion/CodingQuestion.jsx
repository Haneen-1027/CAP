import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

export default function CodingQuestion({
  darkMode,
  addQuestionAnswer,
  question,
}) {
  const [code, setCode] = useState("");

  //////
  useEffect(() => {
    console.log("Coding Question: ", question);
  }, []);
  //////
  return (
    <>
      <div className="row overflow-xAxis">
        <div className="col-4 row border m-0">
          <div className="p-2 col-12">Description</div>
          <hr />
          <div className="col-12">
            <span className="">
              <strong>Examples:</strong>
            </span>
            <ul>
              {question.detailes.testCases.map((testCase, index) => {
                return (
                  <>
                    <li className="my-2">
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
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="p-2 col-8 border m-0">
          {" "}
          <Editor
            height="400px"
            language={"python"}
            theme="vs-dark"
            value={code}
            onChange={(newValue) => setCode(newValue)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </>
  );
}
