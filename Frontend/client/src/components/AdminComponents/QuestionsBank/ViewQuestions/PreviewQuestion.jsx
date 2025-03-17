import React, { useEffect, useState } from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";
import { Link, useParams } from "react-router-dom";
import { getQuestionById } from "../../../../APIs/ApisHandaler";

export default function PreviewQuestion({ darkMode }) {
  const { id } = useParams(); 
  const [question, setQuestion] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch question details when the component mounts
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionById(id); 
        setQuestion(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to fetch question details"); 
        setLoading(false); 
      }
    };

    fetchQuestion();
  }, [id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  
  if (error) {
    return <div>{error}</div>;
  }

  // Display question details
  return (
    <>
      <div className="mx-3 mt-4">
        <BackBtn />
        <div className="position-relative p-4 d-flex flex-column">
          <div className="general d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex flex-column flex-md-row gap-4 mb-4 m-md-0">
              <div className="">
                {question
                  ? question.type === "mc"
                    ? "Multiple Choice"
                    : question.type === "essay"
                    ? "Essay"
                    : question.type === "coding"
                    ? "Code-Based"
                    : "Non-valid Type"
                  : "No Data"}
              </div>
              <div className="">
                {question ? question.category : "No Data"}
              </div>
            </div>
          </div>
          <div className="w-50 position-relative my-3">
            {" "}
            <hr className="bold-hr mid-aligment" />
          </div>
          <div className="details d-flex flex-column flex-start">
            <div className="form-group">
              <label className="h5 mid-bold" htmlFor="prompt">
                Question:
              </label>
              <textarea
                className="form-control mt-2 mb-4"
                id="prompt"
                name="questionPrompt"
                placeholder="Question ..."
                value={
                  question ? question.prompt : "Question Prompt ..."
                }
                disabled
              />
            </div>
            {question?.type === "mc" ? ( // Use optional chaining
              <div>Multiple Choice Question Details</div>
            ) : question?.type === "essay" ? (
              <div>Essay Question Details</div>
            ) : question?.type === "coding" ? (
              <div>
                <h5>Test Cases:</h5>
                {question.details.testCases.map((testCase, index) => (
                  <div key={index}>
                    <p>
                      <strong>Inputs:</strong> {testCase.inputs.join(", ")}
                    </p>
                    <p>
                      <strong>Expected Output:</strong>{" "}
                      {testCase.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>No Details Available</div>
            )}
          </div>
          <div className="mid-aligment d-flex justify-content-center w-50 my-4">
            <Link
              to={`/admin/questions_bank/update_question/${id}`} // Use the id from the URL
              state={{ data: question }}
              className="btn btn-primary"
            >
              Update Question
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}