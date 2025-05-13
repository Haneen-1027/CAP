import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AssessmentDetails,
  AssessmentQuestions,
  BackBtn,
} from "../../../../componentsLoader/ComponentsLoader";
import {
  getAssessmentById,
  getQuestionById,
} from "../../../../APIs/ApisHandaler";

export default function AttemptAssessment({ user, darkMode }) {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState("yet");

  const fetchQuestionDetails = async (questionId) => {
    try {
      const response = await getQuestionById(questionId);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch question ${questionId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await getAssessmentById(id);
        const apiData = response.data;

        // Fetch details for all questions
        const questionsWithDetails = await Promise.all(
          apiData.questions.map(async (q) => {
            const questionDetails = await fetchQuestionDetails(q.questionId);
            return {
              id: `Id${q.questionId}`,
              type: questionDetails?.type || "essay",
              mark: q.mark,
              prompt: q.prompt,
              category: questionDetails?.category || "General",
              detailes: transformQuestionDetails(questionDetails),
            };
          })
        );

        const transformedAssessment = {
          id: `Ass-${apiData.id}`,
          createdBy: "unknown",
          name: apiData.name,
          duration: apiData.duration.substring(0, 5),
          time: apiData.time,
          start_time: apiData.startTime.substring(0, 5),
          end_time: apiData.endTime.substring(0, 5),
          total_mark: apiData.totalMark,
          questions_count: apiData.questionsCount,
          questions: questionsWithDetails,
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

  // Transform question details from API to component's expected format
  const transformQuestionDetails = (questionDetails) => {
    if (!questionDetails || !questionDetails.details) return {};

    const details = questionDetails.details;

    if (questionDetails.type === "mc") {
      // Handle True/False questions specially
      if (details.isTrueFalse) {
        return {
          isTrueFalse: true,
          correctAnswer: details.correctAnswer || [],
          wrongOptions: ["true", "false"].filter(
            (opt) => !details.correctAnswer?.includes(opt)
          ),
          options_count: 2, // Always 2 for True/False
        };
      }

      // Regular multiple choice
      return {
        isTrueFalse: false,
        correctAnswer: details.correctAnswer || [],
        wrongOptions: details.wrongOptions || [],
        options_count:
          details.optionsCount ||
          details.correctAnswer?.length + details.wrongOptions?.length ||
          0,
      };
    } else if (questionDetails.type === "coding") {
      return {
        inputsCount: details.inputsCount || 0,
        testCases: details.testCases || [],
        description: details.description || "",
      };
    } else {
      return {};
    }
  };

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
