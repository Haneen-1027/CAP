import React, { useEffect, useState } from "react";
import Joi from "joi";
import { addNewQuestion, updateQuestion } from "../../../../APIs/ApisHandaler";
import {
  BackBtn,
  Coding,
  FilterableDropdown,
  MultipleChoice,
} from "../../../../componentsLoader/ComponentsLoader";
import { useLocation, useParams } from "react-router-dom";

export default function AddQuestion({ userdetails, darkMode }) {
  const location = useLocation();
  const { data } = location.state || {};
  const { id } = useParams();
  const [question, setQuestion] = useState({
    type: "essay",
    category: "HTML",
    prompt: "",
    details: {},
  });
  const [details, setQuestionDetails] = useState({});
  const [codingDescription, setCodingDescription] = useState(
    "This is a defualt description"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [apiLoading, setApiLoading] = useState(false);

  //
  let [errorList, setErrorList] = useState([]);
  let [apiMessage, setApiMessage] = useState("ss");
  let [apiError, setApiError] = useState(false);

  //
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  const categories = [
    { name: "HTML", value: "HTML" },
    { name: "CSS", value: "CSS" },
    { name: "JavaScript", value: "JavaScript" },
    { name: "jQuery", value: "jQuery" },
    { name: "Bootstrap", value: "Bootstrap" },
    { name: "Angular", value: "Angular" },
    { name: "React", value: "React" },
  ];

  //
  /* Validation Function */
  function validateForm() {
    const Schema = Joi.object({
      id: Joi.number(),
      type: Joi.string().trim().min(2).max(100).required(),
      category: Joi.string().trim().min(2).max(15).required(),
      prompt: Joi.string().required(),
      details: Joi.object(),
    });
    return Schema.validate(question, { abortEarly: false });
  }

  //
  const handleGeneralChange = (e) => {
    setApiError(false);
    setApiMessage(null);
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const addQuestion = async () => {
    setApiLoading(true);
    // Call Validation Function
    let validateResult = validateForm();
    if (validateResult.error) {
      setErrorList(validateResult.error.details);
    } else {
      const newDetails = { ...details, description: codingDescription };
      const newQuestion = {
        ...question,
        ["details"]: newDetails,
      };

      try {
        // Update?
        if (isEditing) {
          console.log("question before update:", newQuestion);
          await updateQuestion(newQuestion);
          setApiMessage("Thq Question Updated Successfully!");
        }
        // Add
        else {
          console.log("question before add:", newQuestion);
          await addNewQuestion(newQuestion);
          setApiMessage("Thq Question Addedd Successfully!");
          setQuestion({
            type: "",
            category: "",
            prompt: "",
            details: {},
          });
          setQuestionDetails({});
          setCodingDescription("This is a defualt description");
          setErrorList([]);
          setApiMessage("");
          setApiError(false);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
        setApiError(true);
        setApiMessage("There is an Error! Please try again later.");
      } finally {
        setApiLoading(false);
      }
    }
  };

  ////////////////////
  useEffect(() => {
    if (location.pathname === "/admin/questions_bank/add_question") {
      setIsEditing(false);
      setQuestion({
        type: "",
        category: "",
        prompt: "",
        details: {},
      });
      setQuestionDetails({});
      setCodingDescription("This is a defualt description");
      setErrorList([]);
      setApiMessage("");
      setApiError(false);
      setIsLoading(false);
    } else if (id && data) {
      setIsEditing(true);
      setQuestion(data);
      setQuestionDetails(data.details || {});
    }
  }, [location]);

  // Track when the question state is fully set
  useEffect(() => {
    if (isEditing && question.type && question.category && question.prompt) {
      setIsLoading(false); // Data is ready
    }
  }, [question, isEditing]);
  useEffect(() => {
    setApiError(false);
    setApiMessage("");
  }, [question]);

  ////////////////////
  return (
    <>
      {isEditing ? (
        <div className="mx-3 mt-4">
          {" "}
          <BackBtn />
        </div>
      ) : (
        ""
      )}
      <div className="position-relative p-4 d-flex flex-column">
        {apiMessage ? (
          <div
            className={`alert ${
              apiError ? "alert-danger" : "alert-success"
            } text-center p-3`}
          >
            {apiMessage}
          </div>
        ) : (
          ""
        )}
        <div className="row flex-column flex-md-row align-items-center m-0">
          <div className="col-12 col-md-6 row m-0 justify-content-between">
            <div className="col-12 col-lg-5 form-floating p-0">
              {" "}
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Type:"}
                items={questionTypes}
                handleFunction={handleGeneralChange}
                name={"type"}
                isDisabled={isEditing}
                selectedValue={question.type}
              />
            </div>
            <div className="col-12 col-lg-5 form-floating p-0">
              {" "}
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Category:"}
                items={categories}
                handleFunction={handleGeneralChange}
                name={"category"}
                selectedValue={question.category}
              />
            </div>
          </div>
        </div>
        <div className="w-50 position-relative my-3">
          {" "}
          <hr className="bold-hr mid-aligment" />
        </div>
        {errorList.map((error, index) => (
          <div key={index} className="alert alert-danger">
            {" "}
            {error.message}{" "}
          </div>
        ))}
        <div className={`details d-flex flex-column flex-start`}>
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
                onChange={(e) => handleGeneralChange(e)}
                value={question.prompt}
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
                  onChange={(e) => setCodingDescription(e.target.value)}
                  value={codingDescription}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {isLoading ? (
            <div>Loading...</div> // Show a loading indicator while data is being loaded
          ) : question["type"] === "mc" && question.details ? (
            <MultipleChoice
              darkMode={darkMode}
              setQuestionDetails={setQuestionDetails}
              detailes={
                isEditing
                  ? { ...question.details }
                  : {
                      isTrueFalse: false,
                      correctAnswer: [],
                      wrongOptions: [],
                    }
              }
            />
          ) : question["type"] === "essay" ? (
            <div></div>
          ) : question["type"] === "coding" ? (
            <Coding
              darkMode={darkMode}
              setQuestionDetails={setQuestionDetails}
              isEditing={isEditing}
              details={
                isEditing
                  ? data.details
                  : {
                      inputsCount: 0,
                      testCases: [
                        {
                          expectedOutput: "",
                          inputs: [],
                        },
                      ],
                    }
              }
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="mid-aligment d-flex justify-content-center w-50 my-4">
          <button
            type="submit"
            className="btn btn-success"
            onClick={() => addQuestion()}
            disabled={apiLoading}
          >
            {isEditing
              ? apiLoading
                ? "Updating ..."
                : "Update Question"
              : apiLoading
              ? "Adding ..."
              : "Add Question"}
          </button>
        </div>
      </div>
    </>
  );
}
