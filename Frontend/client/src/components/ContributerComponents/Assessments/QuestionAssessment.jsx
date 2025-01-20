import React, { useState } from "react";
import styles from "./QuestionAssessment.module.css";

export default function QuestionAssessment({ darkMode }) {
    const questions = [
        {
            id: 1,
            question: "What is the atomic number of hydrogen?",
            options: [
                { label: "a. 1", isCorrect: true },
                { label: "b. 2", isCorrect: false },
                { label: "c. 3", isCorrect: false },
                { label: "d. 4", isCorrect: false },
            ],
        },
        {
            id: 2,
            question: "What is the atomic number of copper?",
            options: [
                { label: "a. 23", isCorrect: false },
                { label: "b. 36", isCorrect: false },
                { label: "c. 12", isCorrect: true },
                { label: "d. 21", isCorrect: false },
            ],
        },
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleNext = () => {
        setSelectedOption(null);
        setShowAnswer(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        setSelectedOption(null);
        setShowAnswer(false);
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmitAnswer = () => {
        setShowAnswer(true);
    };

    return (
        <div className={styles.container}>
            <div className={ ` ${darkMode ? " sidebar-question" : styles.sidebar}`}>
                <p>Question {currentQuestionIndex + 1}</p>
                <p>{showAnswer ? "Incorrect" : "Unanswered"}</p>
                <button className={styles.flagButton}>Flag question</button>
            </div>
            <div className={`${darkMode ? " question-theme" : styles.questionArea}`}>
                <h5>{questions[currentQuestionIndex].question}</h5>
                <div>
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <div key={index} className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                id={`option-${index}`}
                                name={`question-${currentQuestionIndex}`}
                                onChange={() => setSelectedOption(option)}
                                disabled={showAnswer}
                            />
                            <label
                                className={`form-check-label ${
                                    showAnswer && option.isCorrect
                                        ? styles.correctAnswer
                                        : showAnswer && selectedOption === option && !option.isCorrect
                                        ? styles.incorrectAnswer
                                        : ""
                                }`}
                                htmlFor={`option-${index}`}
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
                {showAnswer && (
                    <div className={styles.feedback}>
                        The correct answer is:{" "}
                        {
                            questions[currentQuestionIndex].options.find((opt) => opt.isCorrect)
                                .label
                        }
                    </div>
                )}
                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    {!showAnswer ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitAnswer}
                            disabled={!selectedOption}
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
