import React, { useEffect, useState } from "react";
import {
  BackBtn,
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import questions from "../../../AdminComponents/QuestionsBank/ViewQuestions/test.json"; // Get from API
import SearchBarContainer from "../../../SearchBar";

export default function CreateAssessment({ darkMode }) {
  // test feature
  const [slectedTotalMark, setSelectedTotalMark] = useState(0);

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
  // Visible List (Filtered List)
  const [visibleList, setVisibleList] = useState([...questions.questions]);
  // Searching
  const [searchValue, setSearchValue] = useState("");
  let [searchResults, setSearchResults] = useState([]);
  // Filtiration
  const [questionType, setQuestionType] = useState(0);
  const [category, setCategory] = useState(0);
  // Assessment Attributes
  const [assessment, setAssessment] = useState({
    name: "",
    duration: "",
    time: "",
    start_time: "",
    end_time: "",
    total_mark: 0,
    questions_count: 0,
    questions_ids: [],
  });
  const [questionsCount, setQuestionsCount] = useState(0);
  //Errors variables
  let [apiError, setApiError] = useState(false);
  let [noResults, setNoResults] = useState(false);
  let apiErrorMessage = (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="alert alert-danger my-4 mid-bold w-100 d-flex justify-content-center">
        Error!!!
      </div>
      <div className="my-4 mid-bold">
        Theres a proplem! Please wait for us to solve the proplem.
      </div>
    </div>
  );
  let loadingMessage = (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
  //////////////////////
  /**
   * Functions
   */
  function clearResults() {
    setVisibleList([...questions.questions]);
  }
  /** ====================== Search Section ====================== **/
  function handleSearchValue(value) {
    if (value.trim() === "") {
      clearResults();
      setSearchValue(value);
    } else {
      setSearchValue(value);
    }
  }

  function handleSearching() {
    console.log("Start Searching ...");
    if (searchValue.trim() === "") {
      return;
    }
    let srchResultsArray = questions.questions.filter((question) =>
      question.prompt.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log("srchResultsArray: ", srchResultsArray);
    if (srchResultsArray.length === 0) {
      setVisibleList([]);
      setNoResults(true);
    } else {
      setSearchResults(srchResultsArray);
    }
  }

  /** ====================== Filter Section ====================== **/
  function handleCategory(e) {
    setCategory(e.target.value);
  }
  function handleType(e) {
    setQuestionType(e.target.value);
  }
  // Handle Filitiration
  function handleFiltiration(type, category) {
    const typeOptions = questionTypes.map((type) => type.value);
    const categoryOptions = categories.map((category) => category.value);

    let filteredQuestions = [];

    // If search results are available, use them as the base for filtering
    if (searchResults.length > 0 && searchValue.trim() !== "") {
      filteredQuestions = [...searchResults];
    } else {
      // Otherwise, use the full list of questions
      filteredQuestions = [...questions.questions];
    }

    // Apply type filter if a valid type is selected
    if (type !== 0 && typeOptions.includes(type)) {
      filteredQuestions = filteredQuestions.filter(
        (question) => question.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Apply category filter if a valid category is selected
    if (category !== 0 && categoryOptions.includes(category)) {
      filteredQuestions = filteredQuestions.filter(
        (question) => question.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Update the visible list
    setVisibleList(filteredQuestions);

    // Handle no results case
    if (filteredQuestions.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }

  // For rendring questions lists
  function renderQuestions() {
    return visibleList.map((question, index) => {
      const questionId = `Id${index}`;
      const isChecked = assessment.questions_ids.includes(questionId);
      const isDisabled =
        !isChecked &&
        (assessment.questions_ids.length >= assessment.questions_count ||
          slectedTotalMark + question.mark > assessment.total_mark);

      return (
        <tr key={index}>
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
              onChange={(e) => selectQuestion(e, questionId, question.mark)}
              checked={isChecked}
              disabled={isDisabled}
            />
            <label className="ms-2 form-check-label" htmlFor="questionID">
              Select
            </label>
          </td>
        </tr>
      );
    });
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
  function selectQuestion(e, id, mark) {
    const selectedQuestions = [...assessment.questions_ids];

    if (e.target.checked) {
      selectedQuestions.push(id);
      setSelectedTotalMark((prevTotalCount) => prevTotalCount + mark);
    } else {
      // Remove question if unchecked
      const updatedQuestions = selectedQuestions.filter(
        (question_id) => question_id !== id
      );
      setAssessment((prevAssessment) => ({
        ...prevAssessment,
        questions_ids: updatedQuestions, // Update state
      }));
      return;
    }

    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      questions_ids: selectedQuestions, // Update state
    }));
  }

  // Pagination Functions
  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }

  //////////////////////
  /**
   * Effects
   */
  useEffect(() => {
    console.log("Assessment: ", assessment);
  }, [assessment]);

  useEffect(() => {
    // Filter and display questions when the filter option or data changes
    handleFiltiration(questionType, category);
  }, [questionType, category, searchResults]);

  useEffect(() => {
    // Search for a question when the search value changes
    console.log("Search Value: ", searchValue);
    handleSearching();
  }, [searchValue]);
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
            <div className="form-group col-12 col-lg-4 d-flex flex-column">
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
            <div className="form-group my-3 m-lg-0 col-12 col-lg-2 d-flex flex-column">
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
            <div className="p-0 form-group col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
              <div>
                <label htmlFor="time">Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="time"
                  name="time"
                  value={assessment.time}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
              <div>
                <label htmlFor="start_time">Start:</label>
                <input
                  type="time"
                  className="form-control"
                  id="start_time"
                  name="start_time"
                  value={assessment.start_time}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
              <div>
                <label htmlFor="end_time">End:</label>
                <input
                  type="time"
                  className="form-control"
                  id="end_time"
                  name="end_time"
                  value={assessment.end_time}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
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
                  selectedValue={category}
                />
              </div>
              <div className="type col-12 col-md-6">
                <FilterableDropdown
                  darkMode={darkMode}
                  filterType={"Select Question Type:"}
                  items={questionTypes}
                  handleFunction={handleType}
                  selectedValue={questionType}
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
                  value={assessment.questions_count}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
            </div>
          </div>
          {/** Pagination & Search  */}
          <div className="card-header p-4 row m-0 d-flex align-items-md-center">
            <div className="col-12 col-lg-3">
              <SearchBarContainer
                darkMode={darkMode}
                handleSearchValue={handleSearchValue}
                val={searchValue}
                placeHolder={"Search for a Question ..."}
              />
            </div>
            <div className="p-0 my-4 m-md-0 col-12 col-md-8 col-lg-6 d-flex justify-content-md-center align-items-center">
              <PaginationNav
                darkMode={darkMode}
                counts={questionsListCount}
                pageNo={pageNo}
                setPageNo={setPageNo}
                countPerPage={countPerPage}
              />
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex flex-column justify-content-end">
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
              {Array.isArray(visibleList) && visibleList.length > 0 ? (
                <tbody className="table-border-bottom-0">
                  {renderQuestions()}
                </tbody>
              ) : apiError ? (
                apiErrorMessage
              ) : noResults ? (
                <div className="my-4 mid-bold d-flex justify-content-center">
                  No results Found.
                </div>
              ) : (
                loadingMessage
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
