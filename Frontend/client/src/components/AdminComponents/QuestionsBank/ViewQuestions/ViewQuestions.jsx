import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FilterableDropdown,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";
import { Link } from "react-router-dom";
import {
  getAllQuestionsByFilter,
  deleteQuestion,
} from "../../../../APIs/ApisHandaler";

export default function ViewQuestions({ userDetailes, darkMode }) {
  const categories = [
    { name: "All Categories", value: "" },
    { name: "HTML", value: "HTML" },
    { name: "CSS", value: "CSS" },
    { name: "JavaScript", value: "JavaScript" },
    { name: "jQuery", value: "jQuery" },
    { name: "Bootstrap", value: "Bootstrap" },
    { name: "Angular", value: "Angular" },
    { name: "React", value: "React" },
  ];

  const questionTypes = [
    { name: "All Types", value: "" },
    { name: "Multiple Choice", value: "mc" },
    { name: "Essay Question", value: "essay" },
    { name: "Coding Question", value: "coding" },
  ];
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCountPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [questionType, setQuestionType] = useState("");
  const [category, setCategory] = useState("");
  const [noResults, setNoResults] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setNoResults(false);

    try {
      const response = await getAllQuestionsByFilter(
        pageNo,
        countPerPage,
        category,
        questionType
      );

      console.log("API Response:", response);

      if (response && response.questions) {
        setQuestionsList(response.questions);
        setTotalQuestions(
          response.totalCategoryQuestions ||
            response.totalTypeQuestions ||
            response.questions.length
        );
        setNoResults(response.questions.length === 0);
      } else {
        setNoResults(true);
        setQuestionsList([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setNoResults(true);
      setQuestionsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [pageNo, countPerPage, category, questionType]);

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // If user confirms, proceed with deletion
    if (result.isConfirmed) {
      try {
        await deleteQuestion(id);
        // Show success message
        Swal.fire("Deleted!", "Your question has been deleted.", "success");
        // Refresh the questions after deletion
        fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
        // Show error message
        Swal.fire(
          "Error!",
          "There was an error deleting the question.",
          "error"
        );
      }
    }
  };

  function renderQuestions() {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (noResults) {
      return (
        <tr>
          <td colSpan="5" className="text-center">
            No questions found matching your criteria.
          </td>
        </tr>
      );
    }

    return questionsList.map((q, index) => (
      <tr key={q.id}>
        <td className="text-start">
          {((pageNo - 1) * countPerPage + index + 1)
            .toString()
            .padStart(2, "0")}
          .
        </td>
        <td className="">{q.category || "Null"}</td>
        <td className="text-start text-truncate" style={{ maxWidth: "15rem" }}>
          {q.prompt || "There is no valid question."}
        </td>
        <td className="text-start">
          {q.type === "mc"
            ? q.details?.isTrueFalse
              ? "True/False"
              : "Multiple Choice"
            : q.type === "essay"
            ? "Essay"
            : q.type === "coding"
            ? "Coding"
            : "Not-valid type"}
        </td>
        <td className="gap-2">
          <Link
            to={`/questions_bank/${q.id}`}
            state={{ question: q }}
            className={`btn view-button ${darkMode ? "text-light" : ""}`}
          >
            <i className="fa-regular fa-eye"></i>
          </Link>
          <button
            className={`btn delete-button ${darkMode ? "text-light" : ""}`}
            onClick={() => handleDelete(q.id)}
          >
            <i className="fa-solid fa-trash" />
          </button>
        </td>
      </tr>
    ));
  }

  function handleCountPerPageMenu(e) {
    setCountPerPage(Number(e.target.value));
    setPageNo(1); // Reset to first page when page size changes
  }

  function handleCategory(e) {
    setCategory(e.target.value);
    setPageNo(1); // Reset to first page when filter changes
  }

  function handleType(e) {
    setQuestionType(e.target.value);
    setPageNo(1); // Reset to first page when filter changes
  }

  return (
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
            counts={totalQuestions}
            pageNo={pageNo}
            setPageNo={setPageNo}
            countPerPage={countPerPage}
          />
        </div>
        <div className="count-per-page col-12 col-lg-3 d-flex flex-column flex-lg-row align-items-center">
          <label className="me-2" style={{ fontSize: "0.95rem" }}>
            Questions per Page:
          </label>
          <select
            className="form-select"
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
        <table className={`table ${darkMode ? "table-dark " : "table-light"}`}>
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
  );
}
