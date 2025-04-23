import React, { useEffect, useState } from "react";
import {
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
// import questions from "./test.json"; // Get from API
import { Link } from "react-router-dom";
import { getAllQuestions, deleteQuestion } from "../../../../APIs/ApisHandaler";

export default function ViewQuestions({ userDetailes, darkMode }) {
  const categories = [
    { name: "HTML", value: "HTML" },
    { name: "CSS", value: "CSS" },
    { name: "JavaScript", value: "JavaScript" },
    { name: "jQuery", value: "jQuery" },
    { name: "Bootstrap", value: "Bootstrap" },
    { name: "Angular", value: "Angular" },
    { name: "React", value: "React" },
  ];
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];

  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(33);
  const [questionsList, setQuestionsList] = useState([]); //new new

  // Searching
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Filtiration
  const [questionType, setQuestionType] = useState(0);
  const [category, setCategory] = useState(0);
  const [noResults, setNoResults] = useState(false);

  //
  const viewAllQuestions = async () => {
    try {
      const response = await getAllQuestions();
      console.log("All questions:", response.data);
      setQuestionsList(response.data);
      setQuestionsCount(response.data.length);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  // viewAllQuestions();

  // Fetch questions when the component mounts
  useEffect(() => {
    viewAllQuestions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id); // Call the delete API
      setQuestionsList((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== id)
      ); // Remove the question from the state
      setQuestionsCount((prevCount) => prevCount - 1); // Update the count
      console.log("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  function renderQuestions() {
    // const questionsList = questions.questions;
    return questionsList.map((q, index) => (
      <tr key={index}>
        <td className="text-start">
          {index < 9 ? "0" + (index + 1) : index + 1}.
        </td>
        <td className="">{q.category ? q.category : "Null"}</td>
        <td
          className="text-start text-truncate"
          style={{
            maxWidth: "15rem",
          }}
        >
          {q.prompt ? q.prompt : "There is no valid question."}
        </td>
        <td className="text-start">
          {q.type
            ? q.type === "mc"
              ? q.detailes?.isTrueFalse === true
                ? "True/False"
                : "Multiple Choice"
              : q.type === "essay"
              ? "Essay"
              : q.type === "coding"
              ? "Coding"
              : "Not-valid type"
            : "There is no Type"}
        </td>
        <td className="gap-2">
          <Link
            to={`/admin/questions_bank/preview/${q.id}`}
            state={{ question: q }}
            className={`btn view-button ${darkMode ? "text-light" : ""}`}
          >
            <i className="fa-regular fa-eye"></i>
          </Link>
          <div
            className={`btn delete-button ${darkMode ? "text-light" : ""}`}
            onClick={() => handleDelete(q.id)}
          >
            <i className="fa-solid fa-trash" />
          </div>
        </td>
      </tr>
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
    console.log("Category from `ViewQuestions`: ", category);
  }, [category]);
  ///////////////
  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        <div
          className={`p-3 card-header d-flex align-items-center ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h5 className="text-center mb-0">
            <strong>Questions:</strong>
          </h5>
        </div>
        <div className="p-4 card-header row m-0">
          <div className="col-12 col-lg-5 d-flex flex-column flex-lg-row justify-content-between row m-0 ">
            <div className="category col-12 col-lg-5">
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Category:"}
                items={categories}
                handleFunction={handleCategory}
                selectedValue={category}
              />
            </div>
            <div className="type col-12 col-lg-5">
              <FilterableDropdown
                darkMode={darkMode}
                filterType={"Select Question Type:"}
                items={questionTypes}
                handleFunction={handleType}
                selectedValue={questionType}
              />
            </div>
          </div>
          <div className="my-4 m-lg-0 col-12 col-lg-4 d-flex justify-content-center align-items-center">
            <PaginationNav
              darkMode={darkMode}
              counts={questionsCount}
              pageNo={pageNo}
              setPageNo={setPageNo}
              countPerPage={countPerPage}
            />
          </div>
          <div className="count-per-page col-12 col-lg-3 d-flex flex-column flex-lg-row">
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

        <div
          className={`table-responsive text-nowrap ${
            darkMode ? "spic-dark-mode" : ""
          }`}
        >
          <table
            className={`table ${darkMode ? "table-dark " : "table-light"}`}
          >
            <thead>
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Category</th>
                <th className="text-start">Prompt</th>
                <th className="text-start">Type</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">{renderQuestions()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
