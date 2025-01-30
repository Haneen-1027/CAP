import React, { useEffect, useState } from "react";

export default function MultipleChoice({ darkMode, setQuestionDetails }) {
  const [details, setDetails] = useState({
    isTrueFalse: false,
    correctAnswer: "",
    wrongOptions: [],
  });
  const [isTrueFalse, setIsTrueFalse] = useState(false);
  const [wrongOptionsCount, setWrongOptionsCount] = useState(3);
  const [wrongOptions, setWrongOptions] = useState([]);

  //
  function handleInputs(e) {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }
  async function handleWrongOptions(e, i) {
    const { value } = e.target;

    setWrongOptions((prevWrongOptions) => {
      const updatedWrongOptions = [...prevWrongOptions];
      const existingOptionIndex = updatedWrongOptions.findIndex(
        (option) => option.i === i
      );

      if (existingOptionIndex !== -1) {
        updatedWrongOptions[existingOptionIndex] = { i, value };
      } else {
        updatedWrongOptions.push({ i, value });
      }

      return updatedWrongOptions;
    });
  }

  //
  function renderWrongOptions() {
    let rows = [];
    for (let i = 0; i < wrongOptionsCount; i++) {
      let row = (
        <>
          <div
            key={i}
            className="col-12 col-md-6 col-lg-4 d-flex justify-content-center  align-items-md-center gap-2 mb-4"
          >
            <label
              className="form-check-label m-0"
              htmlFor="wrongQuestionsCount"
            >
              Option {i < 9 ? "0" + (i + 1) : i + 1}:
            </label>
            <input
              className="form-input"
              type="text"
              id={`wrongOption${i}`}
              placeholder={`wrongOption${i + 1}`}
              name="wrongOptions"
              onChange={(e) => handleWrongOptions(e, i)}
            />
            {}
          </div>
        </>
      );
      rows.push(row);
    }
    return rows;
  }
  /////////////////////////////////////////////////////////////d-flex flex-column flex-md-row gap-2 flex-wrap
  useEffect(() => {
    console.log("isTrueFalse: ", isTrueFalse);
    setDetails((prevDetails) => ({
      ...prevDetails,
      ["isTrueFalse"]: isTrueFalse,
      ["correctAnswer"]: isTrueFalse ? "true" : "",
      ["wrongOptions"]: [],
    }));
  }, [isTrueFalse]);
  //
  useEffect(() => {
    console.log("details: ", details);
    setQuestionDetails(details);
  }, [details]);
  //
  useEffect(() => {
    setDetails((prevDetails) => ({
      ...details,
      ["wrongOptions"]: wrongOptions,
    }));
  }, [wrongOptions]);

  //////
  return (
    <>
      <div className="d-flex justify-content-between justify-content-md-evenly align-items-md-center flex-column flex-md-row">
        <div className="d-flex gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue
            id="flexCheckDefault"
            onChange={(e) => setIsTrueFalse(!isTrueFalse)}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            True/False Question
          </label>
        </div>
        <div className="my-4 m-md-0">
          {isTrueFalse ? (
            <div className="">
              <select
                className="p-2"
                style={{ width: "100%" }}
                onChange={(e) => handleInputs(e)}
                name="correctAnswer"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <input
                className="form-input"
                type="text"
                id="correctAnswerText"
                name="correctAnswer"
                placeholder="Correct Answer"
                onChange={(e) => handleInputs(e)}
              />
            </div>
          )}
        </div>
      </div>
      {!isTrueFalse ? (
        <>
          <div className="d-flex flex-column flex-md-row align-items-md-center my-3">
            <div className="d-flex align-items-md-center gap-2">
              <label className="form-label m-0" htmlFor="wrongQuestionsCount">
                Options Count:
              </label>
              <input
                className="form-input flex-1 w-25"
                type="number"
                id="wrongQuestionsCount"
                min={3}
                max={20}
                value={wrongOptionsCount}
                onChange={(e) =>
                  setWrongOptionsCount(
                    e.target.value >= 20
                      ? 20
                      : e.target.value <= 3
                      ? 3
                      : e.target.value
                  )
                }
              />
            </div>
          </div>
          <div className="row my-2">{renderWrongOptions()}</div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
