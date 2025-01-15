import React, { useEffect } from "react";

export default function MultipleChoice({
  darkMode,
  isTrueFalse,
  setIsTrueFalse,
}) {
  useEffect(() => {
    console.log("isTrueFalse: ", isTrueFalse);
  }, [isTrueFalse]);
  //////
  return (
    <>
      <div className="">
        <div className="d-flex gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue
            id="flexCheckDefault"
            onChange={(e) => setIsTrueFalse(!isTrueFalse)}
          />
          <label
            className="form-check-label mid-bold"
            htmlFor="flexCheckDefault"
          >
            True/False Question
          </label>
        </div>
        <div className=""></div>
      </div>
    </>
  );
}
