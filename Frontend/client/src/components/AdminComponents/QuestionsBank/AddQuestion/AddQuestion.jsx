import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Joi from "joi";
import { addNewQuestion, updateQuestion } from "../../../../APIs/ApisHandaler";
import {
  BackBtn,
  Coding,
  FilterableDropdown,
  MultipleChoice,
} from "../../../../componentsLoader/ComponentsLoader";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function AddQuestion({ userdetails, darkMode }) {
  const location = useLocation();
  const { data } = location.state || {};
  const { id } = useParams();
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState({
    type: "",
    category: "",
    prompt: "",
    details: {},
  });
  const [details, setQuestionDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();


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
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

const addQuestion = async () => {
  // First validate the form
  let validateResult = validateForm();
  if (validateResult.error) {
    setErrorList(validateResult.error.details);
    return; // Exit if validation fails
  }

  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: isEditing ? 'Do you want to update this question?' : 'Do you want to add this question?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: isEditing ? 'Yes, update it!' : 'Yes, add it!',
    cancelButtonText: 'Cancel'
  });

  // If user confirms, proceed with the operation
  if (result.isConfirmed) {
    const newDetails = {
      ...details,
      ["description"]: "this is static description",
    };
    const newQuestion = {
      ...question,
      ["details"]: newDetails,
    };

    try {
      // Update?
      if (isEditing) {
        console.log("question before update:", newQuestion);
        await updateQuestion(newQuestion)
          .then((response) => {
            console.log(`The axios response is: ${response}`);
            Swal.fire(
              'Updated!',
              'Your question has been updated.',
              'success'
            ).then(() => {
              navigate('/admin/questions_bank/preview');
            });
          })
          .catch((e) => {
            console.error(e);
            Swal.fire(
              'Error!',
              'There was an error updating the question.',
              'error'
            );
          });
      }
      // Add
      else {
        console.log("question before update for add:", newQuestion);
        await addNewQuestion(newQuestion)
          .then((response) => {
            console.log(`The axios response is: ${response}`);
            Swal.fire(
              'Added!',
              'Your question has been added.',
              'success'
            ).then(() => {
              navigate('/admin/questions_bank/preview');
            });
          })
          .catch((e) => {
            console.error(e);
            Swal.fire(
              'Error!',
              'There was an error adding the question.',
              'error'
            );
          });
      }
    } catch (e) {
      console.error(e);
      Swal.fire(
        'Error!',
        'An unexpected error occurred.',
        'error'
      );
    }
  }
};

  ////////////////////
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setQuestionId(id);
      setQuestion(data); // Set the question state with the passed data
    } else {
      setIsLoading(false); // If not editing, no need to wait for data
    }
    console.log(`state data:`, data);
  }, []);

  // Track when the question state is fully set
  useEffect(() => {
    if (isEditing && question.type && question.category && question.prompt) {
      setIsLoading(false); // Data is ready
    }
  }, [question, isEditing]);

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
              value={question.prompt}
            />
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
          >
            {isEditing ? "Update Question" : "Add Question"}
          </button>
        </div>
      </div>
    </>
  );
}
