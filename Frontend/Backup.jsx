import React, { useEffect, useState } from "react";

export default function Coding({ darkMode, setQuestionDetails }) {
  const [testCasesCount, setTestCasesCount] = useState(1);
  const [testCases, setTestCases] = useState([
    {
      expectedOutput: "",
      inputsCount: 0,
      inputs: [],
    },
  ]);
  //
  function handleExpectedOutput(e, index) {
    const { value } = e.target;
    const updatedTestCases = [...testCases];
    updatedTestCases[index]["expectedOutput"] = value;
    setTestCases(updatedTestCases);
  }

  //
  function handleTestCasses(e, index) {}

  //
  function handleInputValue(e, caseIndex, inputIndex) {
    setTestCases((prevCases) => {
      return prevCases.map((testCase, i) => {
        if (i !== caseIndex) return testCase; // Keep other test cases unchanged

        let updatedInputs = [...testCase.inputs]; // Copy current inputs array
        updatedInputs[inputIndex] = e.target.value;
        return { ...testCase, inputs: updatedInputs }; // Return updated test case
      });
    });
  }
  //
  function handleInputsArrayForCase(newSize, index) {
    setTestCases((prevCases) => {
      return prevCases.map((testCase, i) => {
        if (i !== index) return testCase; // Keep other test cases unchanged

        let updatedInputs = [...testCase.inputs]; // Copy current inputs array

        if (newSize < updatedInputs.length) {
          // Remove extra inputs
          updatedInputs = updatedInputs.slice(0, newSize);
        } else if (newSize > updatedInputs.length) {
          // Add new inputs
          const newInputs = Array.from(
            { length: newSize - updatedInputs.length },
            () => ""
          );
          updatedInputs = [...updatedInputs, ...newInputs];
        }

        return { ...testCase, inputs: updatedInputs }; // Return updated test case
      });
    });
  }

  //
  async function handleInputsCountForCase(e, index) {
    const value = Math.max(0, Math.min(10, Number(e.target.value))); // Clamp value between 0 and 10

    setTestCases((prevCases) =>
      prevCases.map((testCase, i) =>
        i === index ? { ...testCase, inputsCount: value } : testCase
      )
    );

    // Ensure input fields update properly after state update
    setTimeout(() => handleInputsArrayForCase(value, index), 0);
  }

  //
  function renderInputs(index) {
    if (testCases[index]["inputsCount"] === 0) {
      return;
    }
    let rows = [];
    for (let i = 0; i < testCases[index]["inputsCount"]; i++) {
      let row = (
        <>
          <div key={i} className="col-12 col-md-6 col-lg-4 d-flex gap-2 mb-2">
            <label htmlFor={`input${i}`}>
              Input #{i < 9 ? "0" + (i + 1) : i + 1}
            </label>
            <input
              id={`input${i}`}
              type="text"
              onChange={(e) => handleInputValue(e, index, i)}
            />
          </div>
        </>
      );
      rows.push(row);
    }
    return rows;
  }
  //
  function renderTestCasses() {
    let rows = [];
    for (let i = 0; i < testCasesCount; i++) {
      const testCase = testCases[i] || {
        expectedOutput: "",
        inputsCount: 0,
        inputs: [],
      };

      let row = (
        <React.Fragment key={i}>
          <hr className="w-50" />
          <div className="d-flex flex-column justify-content-center justify-content-md-start mb-4 gap-3">
            <div id={`testCase${i}`} className="d-flex flex-column gap-4">
              <label
                className="form-check-label mid-bold m-0"
                htmlFor={`testCase${i}`}
              >
                Case #{i < 9 ? "0" + (i + 1) : i + 1}:
              </label>
              <div className="d-flex flex-column gap-2 gap-md-5 flex-md-row">
                <div
                  id="inputsCountSection"
                  className="d-flex gap-2 align-items-center"
                >
                  <label className="form-check-label m-0" htmlFor="inputsCount">
                    Inputs Count:
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    id="inputsCount"
                    min={0}
                    max={10}
                    value={testCase.inputsCount}
                    onChange={(e) => handleInputsCountForCase(e, i)}
                  />
                </div>
                <div
                  id="expectedOutput"
                  className="d-flex flex-column flex-md-row gap-2 justify-content-center justify-content-md-start align-items-md-center"
                >
                  <label
                    className="form-check-label m-0"
                    htmlFor={`expectedOutput${i}`}
                  >
                    Expected Output:
                  </label>
                  <input
                    className="form-input flex-1"
                    type="text"
                    id={`expectedOutput${i}`}
                    value={testCase.expectedOutput}
                    onChange={(e) => handleExpectedOutput(e, i)}
                  />
                </div>
              </div>
              <div id="inputs" className="row">
                {testCase.inputsCount === 0 ? "" : renderInputs(i)}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
      rows.push(row);
    }
    return rows;
  }

  ///////////////////////
  useEffect(() => {
    setTestCases((prevTestCases) => {
      if (testCasesCount < prevTestCases.length) {
        // Remove the last element if count decreases
        return prevTestCases.slice(0, testCasesCount);
      } else if (testCasesCount > prevTestCases.length) {
        // Add new test cases if count increases
        const newCases = Array.from(
          { length: testCasesCount - prevTestCases.length },
          () => ({
            expectedOutput: "",
            inputsCount: 0,
            inputs: [],
          })
        );
        return [...prevTestCases, ...newCases];
      }
      return prevTestCases; // No change if count is the same
    });
  }, [testCasesCount]);
  //
  useEffect(() => {
    console.log(
      "TestCasesCount: ",
      testCasesCount,
      ", and the array is: ",
      testCases
    );
  }, [testCases]);
  //////////////////////////////////////////
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
              min={1}
              value={testCasesCount}
              onChange={(e) =>
                setTestCasesCount(e.target.value < 1 ? 1 : e.target.value)
              }
            />
          </div>
        </div>
        <div className="my-2">{renderTestCasses()}</div>
      </div>
    </>
  );
}
