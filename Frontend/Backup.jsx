import React, { useEffect, useState } from "react";
import {
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import questions from "./test.json"; // Adjust path based on file location
import { Link } from "react-router-dom";

export default function ViewQuestions({ userDetailes, darkMode }) {
  const categories = [
    { name: "All Categories", value: "all" },
    { name: "HTML", value: "html" },
    { name: "CSS", value: "css" },
    { name: "JavaScript", value: "js" },
    { name: "jQuery", value: "j-query" },
    { name: "Bootstrap", value: "bootstrap" },
    { name: "Angular", value: "angular" },
    { name: "React", value: "react" },
  ];
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  const [questionType, setQuestionType] = useState("mc");
  const [category, setCategory] = useState("all");
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(33);

  //
  function renderQuestions() {
    const questionsList = questions.questions;
    return questionsList.map((q, index) => (
      <>
        <div key={index} className="row d-flex align-items-center p-2">
          <div className="col-4 col-md-2 d-flex gap-4">
            <div className="">{index < 9 ? "0" + (index + 1) : index + 1}.</div>
            <div className="">{q.category ? q.category : "Null"}</div>
          </div>
          <div className="col-8 col-md-5 text-truncate">
            {q.prompt ? q.prompt : "There is no valid question."}
          </div>
          <div className="col-6 col-md-3">
            {q.type
              ? q.type === "mc"
                ? q.detailes.isTrueFalse === true
                  ? "True/False"
                  : "Multiple Choice"
                : q.type === "essay"
                ? "Essay"
                : q.type === "coding"
                ? "Coding"
                : "Not-valid type"
              : "There is no Type"}
          </div>
          <div className="col-6 col-md-2 d-flex justify-content-end gap-2">
            <Link
              to={`/admin/questions_bank/preview/${1234}`}
              state={{ question: q }}
              className={`btn view-button ${darkMode ? "text-light" : ""}`}
            >
              <i class="fa-regular fa-eye"></i>
            </Link>
            <div
              className={`btn delete-button ${darkMode ? "text-light" : ""}`}
            >
              <i className="fa-solid fa-trash" />
            </div>
          </div>
        </div>
        <div className="position-relative my-1">
          {" "}
          <hr className="" />
        </div>
      </>
    ));
  }
  ////
  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }
  function handleCategory(e) {
    setCategory(e.target.value);
  }
  function handleType(e) {
    setQuestionType(e.target.value);
  }

  ///////////////////////
  useEffect(() => {
    console.log(
      "Category from `ViewQuestions`: ",
      category,
      " and questions are: ",
      questions
    );
  }, [category]);
  ///////////////
  return (
    <>
      <div className="mx-3 mt-4">
        <div className="row gap-4 gap-lg-0 my-1">
          <div className="col-12 col-lg-4 d-flex flex-column flex-lg-row gap-2">
            <div className="category">
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Category:"}
                items={categories}
                handleFunction={handleCategory}
              />
            </div>
            <div className="type">
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Type:"}
                items={questionTypes}
                handleFunction={handleType}
              />
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <PaginationNav
              darkMode={darkMode}
              counts={questionsCount}
              pageNo={pageNo}
              setPageNo={setPageNo}
              countPerPage={countPerPage}
            />
          </div>
          <div className="count-per-page col-12 col-lg-3 d-flex flex-column flex-lg-row gap-2">
            <label className="" style={{ fontSize: "0.95rem" }}>
              Questions per Page:
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={countPerPage}
              onChange={handleCountPerPageMenu}
            >
              {countPerPageValues.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="position-relative mt-4">
          {" "}
          <hr className="" />
        </div>
        <div>{renderQuestions()}</div>
      </div>
    </>
  );
}
