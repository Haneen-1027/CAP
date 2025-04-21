import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AssessmentDetails,
  AssessmentQuestions,
  BackBtn,
} from "../../../../componentsLoader/ComponentsLoader";
import { getAssessmentById } from "../../../../APIs/ApisHandaler";

export default function AttemptAssessment({ user, darkMode }) {
  const { id } = useParams(); // Get assessment ID
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isStarted, setIsStarted] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState("yet");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await getAssessmentById(id);
        const apiData = response.data;
        
        // Transform the backend data 
        const transformedAssessment = {
          id: `Ass-${apiData.id}`,
          createdBy: "unknown", // need update
          name: apiData.name,
          duration: apiData.duration.substring(0, 5), // Convert "01:00:00" to "01:00"
          time: apiData.time,
          start_time: apiData.startTime.substring(0, 5), // Convert "14:05:00" to "14:05"
          end_time: apiData.endTime.substring(0, 5),
          total_mark: apiData.totalMark,
          questions_count: apiData.questionsCount,
          questions: apiData.questions.map((q, index) => ({
            id: `Id${index}`,
            type: getQuestionType(q.prompt), //  need to implement 
            mark: q.mark,
            prompt: q.prompt,
            category: "General", // Default category
            detailes: getQuestionDetails(q.prompt, q.mark) // need to implement 
          }))
        };
        
        setAssessment(transformedAssessment);
        checkTimeRange(apiData.time, apiData.startTime, apiData.endTime);
      } catch (err) {
        setError(err.message || "Failed to fetch assessment");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const checkTimeRange = (date, startTime, endTime) => {
    const now = new Date();
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (now < startDateTime) {
      setIsWithinRange("yet");
    } else if (now >= startDateTime && now <= endDateTime) {
      setIsWithinRange("now");
    } else {
      setIsWithinRange("passed");
    }
  };

  // determine question type based on prompt
  const getQuestionType = (prompt) => {
    // to determine question type
    // example 
    if (prompt.toLowerCase().includes("which")) return "mc";
    if (prompt.toLowerCase().includes("write code")) return "coding";
    return "essay";
  };

  // generate question details
  const getQuestionDetails = (prompt, mark) => {
    // example
    const type = getQuestionType(prompt);
    
    if (type === "mc") {
      return {
        isTrueFalse: false,
        correctAnswer: ["Sample answer"],
        wrongOptions: ["Option 1", "Option 2", "Option 3"],
        options_count: 4
      };
    } else if (type === "coding") {
      return {
        inputsCount: 1,
        testCases: [
          { inputs: [1], expectedOutput: [2] },
          { inputs: [2], expectedOutput: [3] }
        ]
      };
    } else {
      return {};
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading assessment...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!assessment) {
    return <div className="text-center my-5">Assessment not found</div>;
  }

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
            setIsWithinRange={setIsWithinRange}
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