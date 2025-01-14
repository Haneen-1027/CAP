import React, { useEffect, useState } from "react";
import {
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";

export default function ViewQuestions({ userDetailes, darkMode }) {
  const categories = [
    "HTML",
    "CSS",
    "JavaScript",
    "jQuery",
    "Bootstrap",
    "Angular",
  ];
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(124);

  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }

  useEffect(() => {
    console.log("countPerPage: ", countPerPage);
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-4">
        <div className="category">
          <FilterableDropdown items={categories} />
        </div>
        <div>
          <PaginationNav
            darkMode={darkMode}
            counts={questionsCount}
            pageNo={pageNo}
            setPageNo={setPageNo}
            countPerPage={countPerPage}
          />
        </div>
        <div className="count-per-page d-flex">
          <label className="w-100" style={{ fontSize: "0.95rem" }}>
            Questions per Page:
          </label>
          <select
            className="form-select w-50"
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
    </>
  );
}
