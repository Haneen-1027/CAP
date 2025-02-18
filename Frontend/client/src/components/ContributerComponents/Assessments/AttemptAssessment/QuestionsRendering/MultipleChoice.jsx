import React, { useState, useEffect } from "react";

export default function MultipleChoice({
  darkMode,
  addQuestionAnswer,
  question,
}) {
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    let optionsCount = question.detailes.options_count;
    const correctOptions = question.detailes.correctAnswer;
    let wrongOptions = question.detailes.wrongOptions || [];

    let options = [];

    if (optionsCount < correctOptions.length) {
      options = [...correctOptions];
    } else {
      let wrongOptionsCount = optionsCount - correctOptions.length;
      let randomWrongOptions = shuffleArray([...wrongOptions]).slice(
        0,
        wrongOptionsCount
      );
      options = [...correctOptions, ...randomWrongOptions];
    }

    setShuffledOptions(shuffleArray(options));
  }, [question]); // Runs only when the question changes

  return (
    <div>
      {shuffledOptions.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="multipleChoice"
            id={`option-${index}`}
            value={option}
            onChange={() => addQuestionAnswer(option, question.id)}
          />
          <label className="form-check-label" htmlFor={`option-${index}`}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}
