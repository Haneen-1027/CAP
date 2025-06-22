import React, { useEffect, useState } from "react";
import {
  BackBtn,
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import SearchBarContainer from "../../../SearchBar";
import {
  addNewAssessment,
  getAllQuestionsByFilter,
} from "../../../../APIs/ApisHandaler";
import { Link } from "react-router";

export default function CreateAssessment({ darkMode }) {
  // Static categories and question types
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
    { name: "Multiple Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];

  // State variables
  const [selectedTotalMark, setSelectedTotalMark] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoading, setAPIloading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  const [apiError, setApiError] = useState(false);

  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);

  // Searching
  const [searchValue, setSearchValue] = useState("");

  // Filtration
  const [questionType, setQuestionType] = useState("");
  const [category, setCategory] = useState("");

  // Assessment Attributes
  const [assessment, setAssessment] = useState({
    name: "",
    duration: "",
    time: "",
    startTime: "",
    endTime: "",
    totalMark: 0,
    questionsCount: 0,
    questionsIds: [],
  });

  // Error messages
  const apiErrorMessage = (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="alert alert-danger my-4 mid-bold w-100 d-flex justify-content-center">
        Error!!!
      </div>
      <div className="my-4 mid-bold">
        There's a problem! Please wait for us to solve the problem.
      </div>
    </div>
  );

  const loadingMessage = (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  // Fetch questions from API with filters
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setApiError(false);

      const response = await getAllQuestionsByFilter(
        pageNo,
        countPerPage,
        category,
        questionType
      );

      if (response && response.questions) {
        setQuestions(response.questions);
        // Use totalCategoryQuestions or totalTypeQuestions depending on your needs
        setTotalQuestionsCount(
          response.totalCategoryQuestions || response.questions.length
        );
      } else {
        setQuestions([]);
        setTotalQuestionsCount(0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setApiError(true);
      setQuestions([]);
      setTotalQuestionsCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [pageNo, countPerPage, category, questionType]);

  const addAssessment = async () => {
    try {
      setAPIloading(true);
      const formatTimeFields = (time) => {
        if (!time) return "00:00:00";
        return time.length === 5 ? `${time}:00` : time;
      };

      // Convert fields before sending
      const preparedAssessment = {
        ...assessment,
        assessmentDate: assessment.time || "2025-01-01",
        startTime: formatTimeFields(assessment.startTime),
        endTime: formatTimeFields(assessment.endTime),
        duration: formatTimeFields(assessment.duration),
      };

      console.log("assessment before Adding:", preparedAssessment);
      await addNewAssessment(preparedAssessment)
        .then((response) => {
          console.log(`The axios response is: ${response}`);
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    } finally {
      setAPIloading(false);
    }
  };

  function handleSearchValue(value) {
    setSearchValue(value);
  }

  function handleSearching() {
    // Since we're now using server-side filtering, we'll implement search as a filter
    fetchQuestions();
  }

  function handleCategory(e) {
    setCategory(e.target.value);
    setPageNo(1); // Reset to first page when changing category
  }

  function handleType(e) {
    setQuestionType(e.target.value);
    setPageNo(1); // Reset to first page when changing type
  }

  function renderQuestions() {
    // Filter questions by search value if it exists
    const filteredQuestions = searchValue
      ? questions.filter((question) =>
          question.prompt.toLowerCase().includes(searchValue.toLowerCase())
        )
      : questions;

    if (filteredQuestions.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            No questions found matching your criteria.
          </td>
        </tr>
      );
    }

    return filteredQuestions.map((question, index) => {
      const isChecked = assessment.questionsIds.some(
        (q) => q.id === question.id
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
          <td>
            {(pageNo - 1) * countPerPage + index + 1 < 10
              ? "0" + ((pageNo - 1) * countPerPage + index + 1)
              : (pageNo - 1) * countPerPage + index + 1}
            .
          </td>
          <td className="text-start">{question.category}</td>
          <td
            className="text-start text-truncate"
            style={{ maxWidth: "20rem" }}
            title={question.prompt}
          >
            {" "}
            <Link
              to={`/admin/questions_bank/preview/${question.id}`}
              className="prompt btn btn-sm btn-outline-success me-2"
              title="Edit Question"
            >
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <strong className="text-truncate">{question.prompt}</strong>
          </td>
          <td className="text-start">
            {question.type === "mc"
              ? question.details?.isTrueFalse === true
                ? "True/False"
                : "Multiple Choice"
              : question.type === "essay"
              ? "Essay"
              : question.type === "coding"
              ? "Coding"
              : "Not-valid type"}
          </td>
          <td className="text-start">
            <input
              className="form-input"
              type="number"
              id="mark"
              name="mark"
              title="Question Mark"
              disabled={!isChecked}
              onChange={(e) => selectQuestion(e, question.id)}
              value={
                isChecked
                  ? assessment.questionsIds.find((q) => q.id === question.id)
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
                    question.id,
                    question.details,
                    question.type
                  )
                }
                value={
                  isChecked
                    ? assessment.questionsIds.find((q) => q.id === question.id)
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
              id={`question-${question.id}`}
              onChange={(e) =>
                selectQuestion(e, question.id, question.details, question.type)
              }
              checked={isChecked}
              disabled={isDisabled}
              title="Add this question to assessment"
            />
            <label
              className="ms-2 form-check-label"
              htmlFor={`question-${question.id}`}
            >
              Select
            </label>
          </td>
        </tr>
      );
    });
  }

  function handleAssessmentAttributes(e) {
    const { name, value } = e.target;

    if (name === "duration") {
      const regex = /^([0-9]{1,2}):([0-5][0-9])$/;
      if (value === "" || regex.test(value)) {
        setAssessment((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setAssessment((prev) => ({ ...prev, [name]: value }));
    }
  }

  function selectQuestion(e, id, q, q_type) {
    const { name, value } = e.target;
    const selectedquestionsIds = [...assessment.questionsIds];

    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        let question = { id: id, mark: 1 };

        if (q_type === "mc") {
          let optionsCount = 0;
          const correctCount = q?.correctAnswer?.length || 0;
          const wrongCount = q?.wrongOptions?.length || 0;
          optionsCount = correctCount > 3 ? correctCount : 4;
          question = { ...question, options_count: optionsCount };
        }

        selectedquestionsIds.push(question);
        setSelectedTotalMark((prev) => prev + question.mark);
        setAssessment((prev) => ({
          ...prev,
          questionsIds: selectedquestionsIds,
        }));
      } else {
        const questionToRemove = selectedquestionsIds.find((q) => q.id === id);
        if (questionToRemove) {
          setSelectedTotalMark((prev) => prev - questionToRemove.mark);
        }
        const updatedquestionsIds = selectedquestionsIds.filter(
          (question) => question.id !== id
        );
        setAssessment((prev) => ({
          ...prev,
          questionsIds: updatedquestionsIds,
        }));
      }
    } else if (name === "mark") {
      const newValue = value.trim() === "" ? 0 : parseInt(value, 10);
      const currentQuestion = selectedquestionsIds.find((q) => q.id === id);
      const sumOfOtherMarks = selectedquestionsIds.reduce(
        (total, q) => (q.id === id ? total : total + q.mark),
        0
      );
      const remainingTotalMark = assessment.totalMark - sumOfOtherMarks;
      const newMark = Math.min(newValue, remainingTotalMark);

      const updatedquestionsIds = selectedquestionsIds.map((question) =>
        question.id === id ? { ...question, mark: newMark } : question
      );

      setSelectedTotalMark((prev) => prev - currentQuestion.mark + newMark);
      setAssessment((prev) => ({ ...prev, questionsIds: updatedquestionsIds }));
    } else if (name === "options_count" && q_type === "mc") {
      const correctCount = q?.correctAnswer?.length || 0;
      const wrongCount = q?.wrongOptions?.length || 0;
      const minOptionsCount = correctCount > 3 ? correctCount : 4;
      const maxOptionsCount = correctCount + wrongCount;
      let newOptionsCount = parseInt(value, 10);

      newOptionsCount = Math.max(
        minOptionsCount,
        Math.min(newOptionsCount, maxOptionsCount)
      );

      const updatedquestionsIds = selectedquestionsIds.map((question) =>
        question.id === id
          ? { ...question, options_count: newOptionsCount }
          : question
      );

      setAssessment((prev) => ({ ...prev, questionsIds: updatedquestionsIds }));
    }
  }

  function handleCountPerPageMenu(e) {
    setCountPerPage(e.target.value);
    setPageNo(1); // Reset to first page when changing items per page
  }

  useEffect(() => {
    handleSearching();
  }, [searchValue]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="alert alert-danger">
        Error loading questions. Please try again later.
      </div>
    );
  }

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
          {/** Assessment Title & Duration & Time  */}
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
          {/** Filtration & Total Mark & Questions Count  */}
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
                counts={totalQuestionsCount}
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
              <tbody className="table-border-bottom-0">
                {isLoading ? loadingMessage : renderQuestions()}
              </tbody>
            </table>
          </div>
          {/** Button to Submit */}
          <div className="card-header row m-0 d-flex align-items-md-center">
            <div className="mid-aligment d-flex justify-content-center w-50">
              <button
                type="submit"
                className="btn btn-success"
                onClick={() => addAssessment()}
                disabled={apiLoading}
              >
                {apiLoading ? "Adding" : "Add Assessment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
