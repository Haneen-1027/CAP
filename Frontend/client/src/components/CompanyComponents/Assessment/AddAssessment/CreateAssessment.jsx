import React, { useEffect, useState } from "react";
import {
  BackBtn,
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import questions from "../../../AdminComponents/QuestionsBank/ViewQuestions/test.json"; // Get from API
import SearchBarContainer from "../../../SearchBar";
import { Link, useLocation, useParams } from "react-router";
import { addNewAssessment } from "../../../../APIs/ApisHandaler";

export default function CreateAssessment({ darkMode }) {
  // test feature
  const [slectedTotalMark, setSelectedTotalMark] = useState(0);

  // For Editing
  const location = useLocation();
  const { data } = location.state || {};
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  ///
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
  const [assessment, setAssessment] = useState(
    data
      ? data
      : {
          name: "",
          duration: "",
          time: "",
          startTime: "",
          endTime: "",
          totalMark: 0,
          questionsCount: 0,
          questionsIds: [],
        }
  );
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

  const addAssessment = async () => {
    // Call Validation Function

    try {
      // Update?
      if (isEditing) {
        console.log("assessment before update:", assessment);
      }
      // Add
      else {
        console.log("assessment before Adding:", assessment);
        await addNewAssessment(assessment)
          .then((response) => {
            console.log(`The axios response is: ${response}`);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      const questionId = `Id${index + question.prompt}`;
      const isChecked = assessment.questionsIds.some(
        (q) => q.id === questionId
      );
      const remainingTotalMark =
        assessment.totalMark -
        assessment.questionsIds.reduce((total, q) => total + q.mark, 0);
      const isDisabled =
        !isChecked &&
        (assessment.questionsIds.length >= assessment.questionsCount ||
          remainingTotalMark === 0);

      return (
        <tr key={index}>
          <td>{index < 9 ? "0" + (index + 1) : index + 1}.</td>
          <td className="text-start">{question.category}</td>
          <td
            className="text-start text-truncate"
            style={{
              maxWidth: "20rem",
            }}
            title={question.prompt}
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
          <td className="text-start">
            <input
              className="form-input"
              type="number"
              id="mark"
              name="mark"
              title="Question Mark"
              disabled={!isChecked}
              onChange={(e) => selectQuestion(e, questionId)}
              value={
                isChecked
                  ? assessment.questionsIds.find((q) => q.id === questionId)
                      ?.mark || 0
                  : ""
              }
            />
          </td>
          <td className="text-start">
            {question.type === "mc" ? (
              <input
                className="form-input"
                type="number"
                id="options_count"
                name="options_count"
                title="Number of Options for Multiple Choice question."
                disabled={!isChecked}
                onChange={(e) =>
                  selectQuestion(
                    e,
                    questionId,
                    question.detailes,
                    question.type
                  )
                }
                value={
                  isChecked
                    ? assessment.questionsIds.find((q) => q.id === questionId)
                        ?.options_count || 0
                    : ""
                }
              />
            ) : (
              "Not Supported"
            )}
          </td>
          <td className="text-start">
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue
              id="questionID"
              name="questionID"
              onChange={(e) =>
                selectQuestion(e, questionId, question.detailes, question.type)
              }
              checked={isChecked}
              disabled={isDisabled}
              title="Add this question to assessment"
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
  function selectQuestion(e, id, q, q_type) {
    const { name, value } = e.target;
    const selectedQuestions = [...assessment.questionsIds];

    if (name === "questionID") {
      if (e.target.checked) {
        // Add the question with an initial mark of 1
        let question = {
          id: id,
          mark: 1,
        };

        console.log("1, Q: ", q);

        // Only calculate options_count for multiple-choice questions
        if (q_type === "mc") {
          console.log("Tyyype: mc");
          let optionsCount = 0; // Default options count for multiple-choice questions
          const correctCount = q.correctAnswer?.length || 0;
          const wrongCount = q.wrongOptions?.length || 0;
          optionsCount = correctCount > 3 ? correctCount : 4;
          question = { ...question, ["options_count"]: optionsCount };
        }

        selectedQuestions.push(question);

        setAssessment((prevAssessment) => ({
          ...prevAssessment,
          questionsIds: selectedQuestions,
        }));
      } else {
        // Remove the question if unchecked
        const questionToRemove = selectedQuestions.find(
          (question) => question.id === id
        );
        if (questionToRemove) {
          setSelectedTotalMark(
            (prevTotalCount) => prevTotalCount - questionToRemove.mark
          );
        }
        const updatedQuestions = selectedQuestions.filter(
          (question) => question.id !== id
        );
        setAssessment((prevAssessment) => ({
          ...prevAssessment,
          questionsIds: updatedQuestions,
        }));
      }
    } else if (name === "mark") {
      let newValue = value;
      if (value.trim() === "") newValue = 0;

      // Find the current question being updated
      const currentQuestion = selectedQuestions.find(
        (question) => question.id === id
      );

      // Calculate the sum of marks for all questions EXCEPT the current one
      const sumOfOtherMarks = assessment.questionsIds.reduce((total, q) => {
        return q.id === id ? total : total + q.mark;
      }, 0);

      // Calculate the remaining total mark, accounting for the current question's mark
      const remainingTotalMark = assessment.totalMark - sumOfOtherMarks;

      // Ensure the new mark does not exceed the remaining total mark
      const newMark = Math.min(parseInt(newValue, 10), remainingTotalMark);

      // Update the mark of the specific question
      const updatedQuestions = selectedQuestions.map((question) => {
        if (question.id === id) {
          // Subtract the old mark and add the new mark to the total
          setSelectedTotalMark(
            (prevTotalCount) => prevTotalCount - question.mark + newMark
          );
          return { ...question, mark: newMark };
        }
        return question;
      });

      setAssessment((prevAssessment) => ({
        ...prevAssessment,
        questionsIds: updatedQuestions,
      }));
    } else if (name === "options_count") {
      console.log("qqqq:", q);
      // Only apply options_count logic for multiple-choice questions
      if (q_type === "mc") {
        const correctCount = q.correctAnswer?.length || 0; // Default to 0 if undefined
        const wrongCount = q.wrongOptions?.length || 0; // Default to 0 if undefined
        const minOptionsCount = correctCount > 3 ? correctCount : 4;
        const maxOptionsCount = correctCount + wrongCount;

        let newOptionsCount = parseInt(value, 10);

        // Enforce the minimum and maximum limits
        if (newOptionsCount < minOptionsCount) {
          newOptionsCount = minOptionsCount;
        } else if (newOptionsCount > maxOptionsCount) {
          newOptionsCount = maxOptionsCount;
        }

        // Update the question's options count
        const updatedQuestions = selectedQuestions.map((question) => {
          if (question.id === id) {
            return { ...question, options_count: newOptionsCount };
          }
          return question;
        });

        // Update state
        setAssessment((prevAssessment) => ({
          ...prevAssessment,
          questionsIds: updatedQuestions,
        }));
      }
    }
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
  useEffect(() => {
    // Search for a question when the search value changes
    console.log("Assessment: ", assessment);
  }, [assessment]);

  useEffect(() => {
    if (id) {
      setAssessment(data);
      setIsEditing(true);
      setSelectedTotalMark((prevMarks) =>
        data.questions.reduce((total, question) => total + question.mark, 0)
      );
      console.log("This is an update for existing Assessment: ", id);
    }
    console.log("State Data: ", data, " and locateion: ", location.state);
  }, []);
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
                value={assessment.name}
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
            <div className="p-0 form-group col-12 col-lg-6 d-flex flex-column flex-md-row justify-content-center justify-content-lg-end">
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
                <label htmlFor="startTime">Start:</label>
                <input
                  type="time"
                  className="form-control"
                  id="startTime"
                  name="startTime"
                  value={assessment.startTime}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
              <div>
                <label htmlFor="endTime">End:</label>
                <input
                  type="time"
                  className="form-control"
                  id="endTime"
                  name="endTime"
                  value={assessment.endTime}
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
            <div className="col-12 col-md-6 row d-flex align-items-center">
              <div className="form-group col-6 d-flex flex-column ">
                <label htmlFor="totalMark">Total Mark:</label>
                <input
                  type="number"
                  className="form-control"
                  id="totalMark"
                  name="totalMark"
                  value={assessment.totalMark}
                  onChange={(e) => handleAssessmentAttributes(e)}
                />
              </div>
              <div className="form-group col-6 d-flex flex-column ">
                <label htmlFor="questionsCount">Questions Count:</label>
                <input
                  type="number"
                  className="form-control"
                  id="questionsCount"
                  name="questionsCount"
                  value={assessment.questionsCount}
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
              className={`table ${
                darkMode ? "table-dark " : "table-light"
              } m-0`}
            >
              <thead className={``}>
                <tr>
                  <th>#.</th>
                  <th className="text-start">Category</th>
                  <th className="text-start" style={{ width: "20rem" }}>
                    Prompt
                  </th>
                  <th className="text-start">Type</th>
                  <th title="Question Mark." className="text-start">
                    Mark
                  </th>
                  <th
                    title="Number of Options for Multiple Choice question."
                    className="text-start"
                  >
                    Options
                  </th>
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
          {/** Button to Submit */}
          <div className="card-header row m-0 d-flex align-items-md-center">
            <div className="mid-aligment d-flex justify-content-center w-50">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => addAssessment()}
              >
                {isEditing ? "Update Assessment" : "Add Assessment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
