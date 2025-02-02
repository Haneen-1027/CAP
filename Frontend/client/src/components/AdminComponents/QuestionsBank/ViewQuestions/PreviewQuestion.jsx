import React, { useState } from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";
import { Link } from "react-router-dom";
export default function PreviewQuestion({ darkMode }) {
  const [question, setQuestion] = useState({
    questionType: "essay",
    questionCategory: "HTML",
    questionMark: 2,
    questionPrompt: "asfasgagagasgasgsag",
    questionDetails: {},
  });
  return (
    <>
      <div className="mx-3 mt-4">
        <BackBtn />
        <div className="position-relative p-4 d-flex flex-column">
          <div className="general d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex flex-column flex-md-row gap-4 mb-4 m-md-0">
              <div>{question ? question.questionType : "Type"}</div>
              <div>{question ? question.questionCategory : "Category"}</div>
            </div>
            <div className="form-group d-flex justify-content-evenly align-items-center">
              <label htmlFor="mark">Mark:</label>
              <input
                type="number"
                className="form-control w-75"
                id="mark"
                name="questionMark"
                placeholder="Question Mark"
                value={question ? question.questionMark : 2}
                disabled
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
                value={
                  question ? question.questionPrompt : "Question Prompt ..."
                }
                disabled
              />
            </div>
            {question["questionType"] === "mc" ? (
              <div>MC</div>
            ) : question["questionType"] === "essay" ? (
              <div></div>
            ) : question["questionType"] === "coding" ? (
              <div>Coding</div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="mid-aligment d-flex justify-content-center w-50 my-4">
            <Link
              to={`/admin/questions_bank/update_question/${1234}`}
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
