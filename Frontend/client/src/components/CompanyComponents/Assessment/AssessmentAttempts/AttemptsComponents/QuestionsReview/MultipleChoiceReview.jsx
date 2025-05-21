import React from "react";

export default function MultipleChoiceReview({
  visiplOptions,
  user_answer,
  isTrueFalse,
  id,
  darkMode,
}) {
  return (
    <>
      <div className="d-flex flex-column">
        {visiplOptions.map((option, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input custom-disabled-input"
              type="radio"
              name={`multipleChoice-${id}`}
              id={`option-${id}-${index}`}
              value={option}
              checked={user_answer === option}
              disabled
            />
            <label
              className={`form-check-label  ${darkMode ? "text-light" : ""}`}
              htmlFor={`option-${id}-${index}`}
            >
              {isTrueFalse
                ? option.charAt(0).toUpperCase() + option.slice(1)
                : option}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
