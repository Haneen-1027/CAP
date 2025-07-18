import React, { useEffect, useState } from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";
import { Link, useParams } from "react-router-dom";
import { getQuestionById } from "../../../../APIs/ApisHandaler";
import MC from "./DetailsComponents/MC";

export default function PreviewQuestion({ user, darkMode }) {
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

  useEffect(() => {
    console.log("User Details: ", user);
  }, []);

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
              <div className="badge bg-secondary fs-6">
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
              <div className="badge bg-success fs-6">
                {question ? question.category : "No Data"}
              </div>
            </div>
          </div>
          <div className="w-50 position-relative my-3">
            {" "}
            <hr className="bold-hr mid-aligment" />
          </div>
          <div className="details d-flex flex-column flex-start">
            <div
              className={`row ${
                question["type"] === "coding"
                  ? "justify-content-between"
                  : "justify-content-center"
              } `}
            >
              <div
                className={`col-12 ${
                  question["type"] === "coding" ? "col-md-5" : "col-md-8"
                } form-group`}
              >
                <label className="h5 mid-bold" htmlFor="prompt">
                  Question:
                </label>
                <textarea
                  className="form-control my-2"
                  id="prompt"
                  name="prompt"
                  placeholder="Question ..."
                  value={question.prompt}
                  disabled
                />
              </div>
              {question["type"] === "coding" ? (
                <div className="col-12 col-md-6 form-group">
                  <label className="h5 mid-bold" htmlFor="prompt">
                    Description:
                  </label>
                  <textarea
                    className="form-control my-2"
                    id="description"
                    name="description"
                    placeholder="Brief Description about the Problem ..."
                    value={question.details.description}
                    disabled
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            {question?.type === "mc" ? ( // Use optional chaining
              <MC details={question.details} darkMode={darkMode} />
            ) : question?.type === "essay" ? (
              <div>Essay Question Details</div>
            ) : question?.type === "coding" ? (
              <div className="my-4">
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
          {user.role === "Admin" ? (
            <div className="mid-aligment d-flex justify-content-center w-50 my-4">
              <Link
                to={`/admin/questions_bank/update_question/${id}`} // Use the id from the URL
                state={{ data: question }}
                className="btn btn-success"
              >
                Update Question
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
