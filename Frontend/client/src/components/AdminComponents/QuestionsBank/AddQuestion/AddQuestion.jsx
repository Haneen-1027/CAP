import React, { useEffect, useState } from "react";
import { FilterableDropdown } from "../../../../componentsLoader/ComponentsLoader";

export default function AddQuestion({ userDetailes, darkMode }) {
  const [questionType, setQuestionType] = useState("");
  const [questionMark, setQuestionMark] = useState(2);
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essy" },
    { name: "Coding Question", value: "coding" },
  ];

  const handleQuestionType = (e) => {
    setQuestionType(e.target.value);
  };
  const handleQuestionMark = (e) => {
    console.log("hi");
    setQuestionMark(e.target.value);
  };
  ////////////////////
  useEffect(() => {
    console.log(
      "QuestionType: ",
      questionType,
      " and QuestionMark: ",
      questionMark
    );
  }, [questionType, questionMark]);
  ////////////////////
  return (
    <>
      <div className="p-4 d-flex flex-column">
        <div className="general d-flex align-items-center justify-content-between">
          <div className="">
            <FilterableDropdown
              darkMode={darkMode}
              filterType={"Select Question Type:"}
              items={questionTypes}
              handleFunction={handleQuestionType}
            />
          </div>
          <div className="form-group d-flex justify-content-evenly align-items-center">
            <label htmlFor="exampleInputPassword1">Mark:</label>
            <input
              type="number"
              className="form-control w-75"
              id="mark"
              name="mark"
              placeholder="Question Mark"
              onChange={(e) => handleQuestionMark(e)}
            />
          </div>
        </div>
        <div className="w-50 position-relative my-4">
          {" "}
          <hr className="bold-hr mid-aligment" />
        </div>
        <div className="details">
          {questionType === "mc" ? (
            <div>Multible Choice Ya Waald!</div>
          ) : questionType === "essy" ? (
            <div>Essay Question Ya Waald!</div>
          ) : questionType === "coding" ? (
            <div>Aklna Hawa Ya Waald!</div>
          ) : (
            <div>E5tar Allah yerda 3nak.</div>
          )}
        </div>
      </div>
    </>
  );
}
