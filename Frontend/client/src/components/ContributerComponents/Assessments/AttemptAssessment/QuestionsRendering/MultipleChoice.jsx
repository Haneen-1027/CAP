import React, { useState, useEffect } from "react";

export default function MultipleChoice({
  darkMode,
  addQuestionAnswer,
  question,
  userAnswer,
}) {
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    // Handle True/False questions specially
    if (question.detailes.isTrueFalse) {
      setShuffledOptions(["true", "false"]);
      return;
    }

    // Regular multiple choice questions
    const correctOptions = question.detailes.correctAnswer || [];
    const wrongOptions = question.detailes.wrongOptions || [];
    const optionsCount = question.detailes.options_count;

    let selectedOptions = [];

    if (optionsCount <= correctOptions.length) {
      // If space is not enough for wrong answers, only use correct ones
      selectedOptions = [...correctOptions.slice(0, optionsCount)];
    } else {
      // Always include all correct options
      const numWrongNeeded = optionsCount - correctOptions.length;
      const randomWrongOptions = shuffleArray(wrongOptions).slice(
        0,
        numWrongNeeded
      );
      selectedOptions = [...correctOptions, ...randomWrongOptions];
    }

    // Shuffle the final list once and store it
    setShuffledOptions(shuffleArray(selectedOptions));
  }, [question.id]);

  return (
    <div>
      {shuffledOptions.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type={question.detailes.isTrueFalse ? "radio" : "radio"}
            name={`multipleChoice-${question.id}`}
            id={`option-${question.id}-${index}`}
            value={option}
            onChange={() =>
              addQuestionAnswer(option, question.id, shuffledOptions)
            }
            checked={userAnswer === option}
          />
          <label
            className={`form-check-label ${darkMode ? "text-light" : ""}`}
            htmlFor={`option-${question.id}-${index}`}
          >
            {question.detailes.isTrueFalse
              ? option.charAt(0).toUpperCase() + option.slice(1)
              : option}
          </label>
        </div>
      ))}
    </div>
  );
}
