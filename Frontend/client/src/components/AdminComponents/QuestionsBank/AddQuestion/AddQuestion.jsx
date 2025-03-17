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

export default function AddQuestion({ userDetailes, darkMode }) {
  const location = useLocation();
  const { data } = location.state || {};
  const { id } = useParams();
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState({
    type: "",
    category: "",
    prompt: "",
    detailes: {},
  });
  const [detailes, setQuestionDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  //
  let [errorList, setErrorList] = useState([]);
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
      type: Joi.string().trim().min(2).max(100).required(),
      category: Joi.string().trim().min(2).max(15).required(),
      prompt: Joi.string().required(),
      detailes: Joi.object().required(),
    });
    return Schema.validate(question, { abortEarly: false });
  }

  //
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const addQuestion = async (details) => {
    // Call Validation Function
    let validateResult = validateForm();
    if (validateResult.error) {
      setErrorList(validateResult.error.details);
    } else {
      const newQuestion = {
        ...question,
        ["detailes"]: detailes,
      };
      try {
        // Update?
        if (isEditing) {
          await updateQuestion(newQuestion)
            .then((response) => {
              console.log(`The axios response is: ${response}`);
            })
            .catch((e) => {
              console.error(e);
            });
        }
        // Add
        else {
          await addNewQuestion(newQuestion)
            .then((response) => {
              console.log(`The axios response is: ${response}`);
            })
            .catch((e) => {
              console.error(e);
            });
        }
      } catch (e) {
        console.error(e);
      }
    }
    // setQuestion((prevQuestion) => ({
    //   ...prevQuestion,
    //   ["detailes"]: detailes,
    // }));
  };

  ////////////////////
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setQuestionId(id);
      setQuestion(data);
      console.log("This is an update for existing Question: ", id);
    }
    console.log("State Data: ", data, " and locateion: ", location.state);
  }, []);
  useEffect(() => {
    console.log("Question: ", question);
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
        <div className="general d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="d-flex flex-column flex-md-row gap-4 mb-4 m-md-0">
            <FilterableDropdown
              darkMode={darkMode}
              filterType={"Select Question Type:"}
              items={questionTypes}
              handleFunction={handleGeneralChange}
              name={"type"}
              isDisabled={isEditing}
              selectedValue={
                isEditing ? (data ? data.type : null) : question.type
              }
            />
            <FilterableDropdown
              darkMode={darkMode}
              filterType={"Select Question Category:"}
              items={categories}
              handleFunction={handleGeneralChange}
              name={"category"}
              selectedValue={
                isEditing ? (data ? data.category : null) : question.category
              }
            />
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
        <div className="details d-flex flex-column flex-start">
          <div className="form-group">
            <label className="h5 mid-bold" htmlFor="prompt">
              Question:
            </label>
            <textarea
              className="form-control my-2"
              id="prompt"
              name="prompt"
              placeholder="Question ..."
              onChange={(e) => handleGeneralChange(e)}
              value={data ? data.prompt : question.prompt}
            />
          </div>
          {question["type"] === "mc" ? (
            <MultipleChoice
              darkMode={darkMode}
              setQuestionDetails={setQuestionDetails}
              detailes={
                isEditing
                  ? { ...question.detailes }
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
              detailes={
                isEditing
                  ? question.detailes
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
            className="btn btn-primary"
            onClick={() => addQuestion()}
          >
            {isEditing ? "Update Question" : "Add Question"}
          </button>
        </div>
      </div>
    </>
  );
}
