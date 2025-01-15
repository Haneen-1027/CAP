import React, { useEffect, useState } from "react";
import {
  Coding,
  FilterableDropdown,
  MultipleChoice,
} from "../../../../componentsLoader/ComponentsLoader";

export default function AddQuestion({ userDetailes, darkMode }) {
  const [question, setQuestion] = useState({
    questionType: "",
    questionCategory: "",
    questionMark: 2,
    questionPrompt: "",
    questionDetails: {},
  });
  const [isTrueFalse, setIsTrueFalse] = useState(false);

  //const [questionType, setQuestionType] = useState("");
  //const [questionPrompt, setQuestionPrompt] = useState("");
  //const [questionCategory, setQuestionCategory] = useState("");
  //const [questionMark, setQuestionMark] = useState(2);
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  const categories = [
    { name: "HTML", value: "html" },
    { name: "CSS", value: "css" },
    { name: "JavaScript", value: "js" },
    { name: "jQuery", value: "j-query" },
    { name: "Bootstrap", value: "bootstrap" },
    { name: "Angular", value: "angular" },
    { name: "React", value: "react" },
  ];

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  ////////////////////
  useEffect(() => {
    console.log("Question: ", question);
  }, [question]);
  ////////////////////
  return (
    <>
      <div className="p-4 d-flex flex-column">
        <div className="general d-flex align-items-center justify-content-between">
          <div className="d-flex gap-4">
            <FilterableDropdown
              darkMode={darkMode}
              filterType={"Select Question Type:"}
              items={questionTypes}
              handleFunction={handleGeneralChange}
              name={"questionType"}
            />
            <FilterableDropdown
              darkMode={darkMode}
              filterType={"Select Question Category:"}
              items={categories}
              handleFunction={handleGeneralChange}
              name={"questionCategory"}
            />
          </div>
          <div className="form-group d-flex justify-content-evenly align-items-center">
            <label htmlFor="mark">Mark:</label>
            <input
              type="number"
              className="form-control w-75"
              id="mark"
              name="questionMark"
              placeholder="Question Mark"
              onChange={(e) => handleGeneralChange(e)}
            />
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
              onChange={(e) => handleGeneralChange(e)}
            />
          </div>
          <div className="w-50 position-relative my-3">
            {" "}
            <hr className="bold-hr mid-aligment" />
          </div>
          {question["questionType"] === "mc" ? (
            <MultipleChoice
              darkMode={darkMode}
              isTrueFalse={isTrueFalse}
              setIsTrueFalse={setIsTrueFalse}
            />
          ) : question["questionType"] === "essay" ? (
            <div></div>
          ) : question["questionType"] === "coding" ? (
            <Coding darkMode={darkMode} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}
