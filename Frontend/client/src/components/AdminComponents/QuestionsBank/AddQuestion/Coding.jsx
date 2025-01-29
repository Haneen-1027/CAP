import React, { useEffect, useState } from "react";

export default function Coding({ darkMode, setQuestionDetails }) {
  const [testCasesCount, setTestCasesCount] = useState(3);

  useEffect(() => {
    console.log("TestCasesCount: ", testCasesCount);
  }, [testCasesCount]);
  return (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center my-3">
          <div className="d-flex justify-content-center flex-column flex-md-row align-items-center gap-2">
            <label
              className="form-label h6 mid-bold m-0"
              htmlFor="wrongQuestionsCount"
            >
              Test Cases Count:
            </label>
            <input
              className="form-input flex-1 w-25"
              type="number"
              id="wrongQuestionsCount"
              value={testCasesCount}
              onChange={(e) => setTestCasesCount(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
