import React, { useEffect, useState } from "react";
import {
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";

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
  const [questionsCount, setQuestionsCount] = useState(124);

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
    console.log("Category from `ViewQuestions`: ", category);
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
        <div className="position-relative mt-3 mb-5">
          {" "}
          <hr className="" />
        </div>
        <div>
          <div className="row d-flex align-items-center">
            <div className="col-4 col-md-2 d-flex gap-4">
              <div className="">1.</div>
              <div className="">HTML</div>
            </div>
            <div className="col-8 col-md-5 text-truncate">
              This is the Question that we want to render. it should be toooooo
              long. This is the Question that we want to render. it should be
              toooooo long.
            </div>
            <div className="col-6 col-md-3">
              {questionType === "mc"
                ? 1
                  ? "True/False"
                  : "Multiple Choice"
                : ""}
            </div>
            <div className="col-6 col-md-2 d-flex justify-content-end gap-2">
              <div
                className={`btn view-button ${darkMode ? "text-light" : ""}`}
              >
                <i class="fa-regular fa-eye"></i>
              </div>
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
        </div>
      </div>
    </>
  );
}
