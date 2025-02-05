import React, { useEffect, useState } from "react";
import {
  BackBtn,
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import questions from "../../../AdminComponents/QuestionsBank/ViewQuestions/test.json"; // Get from API

export default function CreateAssessment({ darkMode }) {
  const [questionsListCount, setQuestionsListCount] = useState(133); // Calculated after get questions from API
  // Get from API
  const categories = [
    { name: "HTML", value: "HTML" },
    { name: "CSS", value: "CSS" },
    { name: "JavaScript", value: "JavaScript" },
    { name: "jQuery", value: "jQuery" },
    { name: "Bootstrap", value: "Bootstrap" },
    { name: "Angular", value: "Angular" },
    { name: "React", value: "React" },
  ];
  // Get from API
  const questionTypes = [
    { name: "Multible Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  //////////////////////
  /**
   * States
   */
  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  // Searching
  const [searchValue, setSearchValue] = useState("");
  // Filtiration
  const [displayQuestionsList, setDisplayQuestionsList] = useState(
    questions.questions
  );
  const [questionType, setQuestionType] = useState("mc");
  const [category, setCategory] = useState("all");
  // Assessment Attributes
  const [assessment, setAssessment] = useState({
    name: "",
    duration: "",
    start_time: "",
    end_time: "",
    total_mark: 0,
    questions_count: 0,
    questions_ids: [],
  });
  const [questionsCount, setQuestionsCount] = useState(0);
  //////////////////////
  /**
   * Functions
   */
  // Handle Searching
  function handleSearching() {}

  // Handle Filitiration
  function handleFiltiration() {}

  // For rendring questions lists
  function renderQuestions() {
    return displayQuestionsList.map((question, index) => (
      <>
        {" "}
        <tr>
          <td>{index < 9 ? "0" + (index + 1) : index + 1}.</td>
          <td className="text-start">{question.category}</td>
          <td
            className="text-start text-truncate"
            style={{
              maxWidth: "20rem",
            }}
          >
            <strong className="text-truncate">{question.prompt}</strong>
          </td>
          <td className="text-start">
            {question.type
              ? question.type === "mc"
                ? question.detailes.isTrueFalse === true
                  ? "True/False"
                  : "Multiple Choice"
                : question.type === "essay"
                ? "Essay"
                : question.type === "coding"
                ? "Coding"
                : "Not-valid type"
              : "There is no Type"}
          </td>
          <td className="text-start">{question.mark}</td>
          <td className="text-start">
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue
              id="questionID"
              onChange={(e) => selectQuestion(e)}
            />
            <label className="ms-2 form-check-label" htmlFor="questionID">
              Select
            </label>
          </td>
        </tr>
      </>
    ));
  }

  // Handle the assessment attributes
  function handleAssessmentAttributes(e) {
    const { name, value } = e.target;
    setAssessment((prevAssessment) => ({ ...prevAssessment, [name]: value }));

    // Ensure "duration" follows HH:MM format
    if (name === "duration") {
      const regex = /^([0-9]{1,2}):([0-5][0-9])$/;
      if (value === "" || regex.test(value)) {
        setAssessment((prevAssessment) => ({
          ...prevAssessment,
          [name]: value,
        }));
      }
    } else {
      setAssessment((prevAssessment) => ({ ...prevAssessment, [name]: value }));
    }
  }
  // Handle the selecting of new question
  function selectQuestion(e) {}
  // Pagination Functions
  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }
  function handleCategory(e) {
    setCategory(e.target.value);
  }
  function handleType(e) {
    setQuestionType(e.target.value);
  }
  //////////////////////
  /**
   * Effects
   */
  useEffect(() => {
    console.log("Assessment: ", assessment);
  }, [assessment]);
  //////////////////////
  return (
    <>
      <BackBtn />
      <div className="my-4">
        <div className={`card ${darkMode ? "spic-dark-mode" : ""}`}>
          <div className="card-header d-flex justify-content-md-center align-items-md-center">
            <h5 className="text-center mb-0">
              <strong>Create a New Assessment</strong>
            </h5>
          </div>
          {/** Assesment Title & Duration & Time  */}
          <div className="card-header p-4 row m-0 d-flex justify-content-between align-items-md-center">
            <div className="form-group gap-1 col-12 col-md-4 d-flex flex-row align-items-center">
              <label htmlFor="name">Title:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Assessment Name"
                onChange={(e) => handleAssessmentAttributes(e)}
              />
            </div>
            <div className="form-group gap-1 col-12 col-md-3 d-flex align-items-center">
              <label htmlFor="duration">Duration:</label>
              <input
                type="text"
                placeholder="hh:mm"
                pattern="^([0-9]{1,2}):([0-5][0-9])$"
                className="form-control"
                id="duration"
                name="duration"
                value={assessment.duration}
                onChange={(e) => handleAssessmentAttributes(e)}
              />
            </div>
            <div className="form-group col-12 col-md-5 d-flex justify-content-md-end">
              Time
            </div>
          </div>
          {/** Filtiration & Total Mark & Questions Count  */}
          <div className="card-header p-4 row gap-1 m-0 d-flex justify-content-between align-items-md-center">
            <div className="col-12 col-md-6 row">
              <div className="category col-12 my-1 m-md-0 col-md-6">
                <FilterableDropdown
                  darkMode={darkMode}
                  filterType={"Select Category:"}
                  items={categories}
                  handleFunction={handleCategory}
                />
              </div>
              <div className="type col-12 col-md-6">
                <FilterableDropdown
                  darkMode={darkMode}
                  filterType={"Select Question Type:"}
                  items={questionTypes}
                  handleFunction={handleType}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 row">
              <div className="form-group col-6 d-flex flex-column ">
                <label htmlFor="total_mark">Total Mark:</label>
                <input
                  type="number"
                  className="form-control"
                  id="total_mark"
                  name="total_mark"
                  value={assessment.total_mark}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
              <div className="form-group col-6 d-flex flex-column ">
                <label htmlFor="questions_count">Questions Count:</label>
                <input
                  type="number"
                  className="form-control"
                  id="questions_count"
                  name="questions_count"
                  value={assessment.total_mark}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
            </div>
          </div>
          {/** Pagination & Search  */}
          <div className="card-header p-4 row m-0 d-flex justify-content-between align-items-md-center">
            <div className="col-12 col-md-3">Search</div>
            <div className="p-0 my-4 m-md-0 col-12 col-md-6 d-flex justify-content-md-center align-items-center">
              <PaginationNav
                darkMode={darkMode}
                counts={questionsListCount}
                pageNo={pageNo}
                setPageNo={setPageNo}
                countPerPage={countPerPage}
              />
            </div>
            <div className="col-12 col-md-3 d-flex flex-column justify-content-end">
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
          {/** Questions to choose  */}
          <div className="table-responsive text-nowrap">
            <table
              className={`table ${darkMode ? "table-dark " : "table-light"}`}
            >
              <thead className={``}>
                <tr>
                  <th>#.</th>
                  <th className="text-start">Category</th>
                  <th className="text-start" style={{ width: "20rem" }}>
                    Prompt
                  </th>
                  <th className="text-start">Type</th>
                  <th className="text-start">Mark</th>
                  <th className="text-start">Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {renderQuestions()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
