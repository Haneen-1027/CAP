import React, { useEffect, useState } from "react";

export default function MultipleChoice({
  darkMode,
  setQuestionDetails,
  isEditing,
  detailes,
}) {
  const [details, setDetails] = useState(detailes);
  const [isTrueFalse, setIsTrueFalse] = useState(detailes.isTrueFalse);
  const [wrongOptionsCount, setWrongOptionsCount] = useState(
    detailes.wrongOptions.length >= 3 ? detailes.wrongOptions.length : 3
  );
  const [wrongOptions, setWrongOptions] = useState(
    detailes?.wrongOptions
      ? [...detailes.wrongOptions]
      : Array.from({ length: 3 }, () => "")
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(
    detailes.correctAnswer.length >= 1 ? detailes.correctAnswer.length : 1
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    detailes?.correctAnswer
      ? [...detailes.correctAnswer]
      : Array.from({ length: 1 }, () => "")
  );

  // Handle input changes for correct answer
  function handleTrueFalse(e) {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: [value],
    }));
  }

  // Handle changes in correct options
  function handleCorrectOptions(e, index) {
    const { value } = e.target;
    setCorrectAnswer((prevCorrectOptions) => {
      const updatedCorrectOptions = [...prevCorrectOptions];
      updatedCorrectOptions[index] = value;
      return updatedCorrectOptions;
    });
  }
  // Handle changes in wrong options
  function handleWrongOptions(e, index) {
    const { value } = e.target;
    setWrongOptions((prevWrongOptions) => {
      const updatedWrongOptions = [...prevWrongOptions];
      updatedWrongOptions[index] = value;
      return updatedWrongOptions;
    });
  }

  // Render Correct options inputs
  function renderCorrectOptions() {
    return correctAnswer.map((option, index) => (
      <div
        key={index}
        className="col-12 col-md-6 col-lg-4 d-flex align-items-md-center gap-2 mb-4"
      >
        <label
          className="form-check-label m-0"
          htmlFor={`correctOption${index}`}
        >
          Option {index < 9 ? "0" + (index + 1) : index + 1}:
        </label>
        <input
          className="form-input"
          type="text"
          id={`correctOption${index}`}
          placeholder={`Correct Option ${index + 1}`}
          value={option}
          onChange={(e) => handleCorrectOptions(e, index)}
        />
      </div>
    ));
  }
  // Render wrong options inputs
  function renderWrongOptions() {
    return wrongOptions.map((option, index) => (
      <div
        key={index}
        className="col-12 col-md-6 col-lg-4 d-flex align-items-md-center gap-2 mb-4"
      >
        <label className="form-check-label m-0" htmlFor={`wrongOption${index}`}>
          Option {index < 9 ? "0" + (index + 1) : index + 1}:
        </label>
        <input
          className="form-input"
          type="text"
          id={`wrongOption${index}`}
          placeholder={`Wrong Option ${index + 1}`}
          value={option}
          onChange={(e) => handleWrongOptions(e, index)}
        />
      </div>
    ));
  }
  /////////////////////////////////////////////////
  // Update details when isTrueFalse changes
  useEffect(() => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      isTrueFalse: isTrueFalse,
      correctAnswer: isTrueFalse ? ["true"] : prevDetails.correctAnswer,
      wrongOptions: isTrueFalse ? [] : wrongOptions,
    }));
  }, [isTrueFalse]);

  // Update details when wrongOptions changes
  useEffect(() => {
    console.log("wrongOptions: ", wrongOptions);
    setDetails((prevDetails) => ({
      ...prevDetails,
      wrongOptions: wrongOptions,
    }));
  }, [wrongOptions]);

  // Update details when correctAnswers changes
  useEffect(() => {
    console.log("correctAnswers: ", correctAnswer);
    setDetails((prevDetails) => ({
      ...prevDetails,
      correctAnswer: correctAnswer,
    }));
  }, [correctAnswer]);

  // Update correct answers array when correctAnswersCount changes
  useEffect(() => {
    setCorrectAnswer((prevCorrectAnswer) => {
      if (correctAnswersCount < prevCorrectAnswer.length) {
        return prevCorrectAnswer.slice(0, correctAnswersCount);
      } else if (correctAnswersCount > prevCorrectAnswer.length) {
        return [
          ...prevCorrectAnswer,
          ...Array.from(
            { length: correctAnswersCount - prevCorrectAnswer.length },
            () => ""
          ),
        ];
      }
      return prevCorrectAnswer;
    });
  }, [correctAnswersCount]);

  // Update wrongOptions array when wrongOptionsCount changes
  useEffect(() => {
    setWrongOptions((prevWrongOptions) => {
      if (wrongOptionsCount < prevWrongOptions.length) {
        return prevWrongOptions.slice(0, wrongOptionsCount);
      } else if (wrongOptionsCount > prevWrongOptions.length) {
        return [
          ...prevWrongOptions,
          ...Array.from(
            { length: wrongOptionsCount - prevWrongOptions.length },
            () => ""
          ),
        ];
      }
      return prevWrongOptions;
    });
  }, [wrongOptionsCount]);

  // Update question details when details change
  useEffect(() => {
    console.log("Details of MC: ", details);
    setQuestionDetails(details);
  }, [details]);

  return (
    <>
      <div className="d-flex gap-4 align-items-md-center flex-column flex-md-row">
        <div className="d-flex gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
            checked={isTrueFalse}
            onChange={(e) => setIsTrueFalse(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            True/False Question
          </label>
        </div>
        <div className="my-4 m-md-0">
          {isTrueFalse ? (
            <div>
              <select
                className="p-2"
                style={{ width: "100%" }}
                onChange={(e) => handleTrueFalse(e)}
                name="correctAnswer"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <hr />
      {!isTrueFalse && (
        <>
          <div className="row d-flex flex-column flex-md-row align-items-md-center my-3">
            <div className="col-12 col-md-3 d-flex align-items-md-center gap-1">
              <label className="form-label m-0" htmlFor="wrongQuestionsCount">
                Correct Answers Count:
              </label>
              <input
                className="form-input flex-1 w-25"
                type="number"
                id="wrongQuestionsCount"
                min={1}
                max={10}
                value={correctAnswersCount}
                onChange={(e) =>
                  setCorrectAnswersCount(
                    e.target.value >= 10
                      ? 10
                      : e.target.value <= 1
                      ? 1
                      : e.target.value
                  )
                }
              />
            </div>
          </div>
          <div className="row my-2">{renderCorrectOptions()}</div>
        </>
      )}
      <hr />
      {!isTrueFalse && (
        <>
          <div className="row d-flex flex-column flex-md-row align-items-md-center my-3">
            <div className="col-12 col-md-3 d-flex align-items-md-center gap-1">
              <label className="form-label m-0" htmlFor="wrongQuestionsCount">
                Wrong Options Count:
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
      )}
    </>
  );
}
