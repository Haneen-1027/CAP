import React, { useState, useEffect } from "react";
import {
  AssessmentDetails,
  AssessmentQuestions,
  BackBtn,
} from "../../../../componentsLoader/ComponentsLoader";

export default function AttemptAssessment({ user, darkMode }) {
  // Get from API by id, or by passing by state
  const assessment = {
    id: "Ass-512512",
    createdBy: "user112",
    name: "JavaScript Basics Quiz",
    duration: "00:45",
    time: "2025-02-14",
    start_time: "10:00",
    end_time: "20:45",
    total_mark: 40,
    questions_count: 4,
    questions: [
      {
        id: "Id0",
        type: "mc",
        mark: 5.0,
        prompt: "Which keyword is used to declare a variable in JavaScript?",
        category: "JavaScript",
        detailes: {
          isTrueFalse: false,
          correctAnswer: ["let"],
          wrongOptions: ["var", "const", "define", "final", "constant"],
          options_count: 4,
        },
      },
      {
        id: "Id1",
        type: "essay",
        mark: 10.0,
        prompt: "Describe the differences between let, const, and var.",
        category: "JavaScript",
        detailes: {},
      },
      {
        id: "Id2",
        type: "coding",
        mark: 15.0,
        prompt: "Write a function to check if a number is prime.",
        category: "JavaScript",
        detailes: {
          inputsCount: 1,
          testCases: [
            { inputs: [2], expectedOutput: [true] },
            { inputs: [4], expectedOutput: [false] },
          ],
        },
      },
    ],
  };
  // Should be handled in server side
  const [isStarted, setIsStarted] = useState(false);
  const [isWithinRange, setisWithinRange] = useState("yet");

  //

  /////////////////
  return (
    <>
      <BackBtn />
      <div className="my-4">
        {!isStarted ? (
          <AssessmentDetails
            darkMode={darkMode}
            assessment={assessment}
            isWithinRange={isWithinRange}
            setIsStarted={setIsStarted}
            setisWithinRange={setisWithinRange}
            isStarted={isStarted}
          />
        ) : (
          <AssessmentQuestions
            user={user}
            darkMode={darkMode}
            assessment={assessment}
            questions={assessment.questions}
          />
        )}
      </div>
    </>
  );
}
