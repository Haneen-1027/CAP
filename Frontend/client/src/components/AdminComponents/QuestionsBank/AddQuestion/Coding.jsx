import React, { useEffect, useState, useRef } from "react";

export default function Coding({
  darkMode,
  setQuestionDetails,
  isEditing,
  details,
}) {
  const [inputsCount, setInputsCount] = useState(
    details.inputsCount >= 0 ? details.inputsCount : 0
  );
  const [testCasesCount, setTestCasesCount] = useState(
    details.testCases.length
  );
  const [testCases, setTestCases] = useState([...details.testCases]);

  //
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);

  //
  function handleExpectedOutput(e, index) {
    const { value } = e.target;
    const updatedTestCases = [...testCases];
    updatedTestCases[index]["expectedOutput"] = value;
    setTestCases(updatedTestCases);
  }

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
  function handleInputsArrayForCase(newSize) {
    setTestCases((prevCases) => {
      return prevCases.map((testCase, i) => {
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
  async function handleInputsCount(e) {
    const value = Math.max(0, Math.min(10, Number(e.target.value))); // Clamp value between 0 and 10

    setInputsCount(value);

    // Ensure input fields update properly after state update
    setTimeout(() => handleInputsArrayForCase(value), 0);
  }

  //
  function renderInputs(index) {
    if (inputsCount === 0) {
      return;
    }
    let rows = [];
    for (let i = 0; i < inputsCount; i++) {
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
              value={
                testCases[index]?.inputs &&
                testCases[index].inputs[i] !== undefined
                  ? testCases[index].inputs[i]
                  : ""
              }
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
                {inputsCount === 0 ? "" : renderInputs(i)}
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
            inputs: Array(inputsCount).fill(""),
          })
        );
        return [...prevTestCases, ...newCases];
      }
      return prevTestCases; // No change if count is the same
    });
  }, [testCasesCount]);
  //
  useEffect(() => {
    console.log("Details from Coding: ", details);
    setQuestionDetails({ inputsCount: inputsCount, testCases: [...testCases] });
  }, [testCases]);
  //
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        // console.log("stickyRef: ", stickyRef);
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top === 60);
      }
    };

    ///
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //////////////////////////////////////////
  return (
    <>
      <div className="d-flex flex-column">
        <div
          ref={stickyRef}
          className={`position-sticky d-flex flex-column flex-md-row justify-content-center align-items-center gap-3  gap-md-0 my-3 ${
            isSticky ? "all-Mid-shadow" : ""
          }`}
          style={{
            top: "60px",
            zIndex: 1000,
            backgroundColor: darkMode ? "#333" : "#fff", // Match your theme
            padding: "2rem 0", // Add padding for better spacing
          }}
        >
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
          <div
            id="inputsCountSection"
            className="d-flex justify-content-center flex-column flex-md-row align-items-center gap-2"
          >
            <label className="form-label h6 mid-bold m-0" htmlFor="inputsCount">
              Inputs Count:
            </label>
            <input
              className="form-input flex-1 w-25"
              type="number"
              id="inputsCount"
              min={0}
              value={inputsCount}
              onChange={(e) => handleInputsCount(e)}
            />
          </div>
        </div>
        <div className="my-2">{renderTestCasses()}</div>
      </div>
    </>
  );
}