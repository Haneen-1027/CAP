import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PaginationNav } from "../../../../componentsLoader/ComponentsLoader";
import SearchBarContainer from "../../../SearchBar";
import assessments from "./assessmentTest.json";

export default function CompAssessment({ user, darkMode }) {
  //////////
  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [assessmentsListCount, setAssessmentsListCount] = useState(15); // Calculated after get questions from API for Pagination
  // Searching
  const [searchValue, setSearchValue] = useState("");
  let [searchResults, setSearchResults] = useState([]);
  //////////
  // Pagination Functions
  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }
  function clearResults() {}
  /** ====================== Search Section ====================== **/
  function handleSearchValue(value) {
    if (value.trim() === "") {
      clearResults();
      setSearchValue(value);
    } else {
      setSearchValue(value);
    }
  }

  function handleSearching() {}

  /** ============= Delete Section */
  async function deleteAssessment(id) {
    try {
      console.log("Assessment Deleted! ", id);
    } catch (error) {
      console.error("Error in 'deleteAssessment(id)': ", error);
    }
  }
  //////////
  useEffect(() => {
    console.log("assessments: ", assessments);
  }, []);
  /////////
  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        <div
          className={`card-header d-flex justify-content-between align-items-center ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h5 className="text-center mb-0">
            <strong>Assessments:</strong>
          </h5>
          <Link
            to="/company/assessment/add"
            type="button"
            className={`btn btn-light btn-sm d-flex align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Assessment
          </Link>
        </div>
        {/** Pagination */}
        <div
          className={`card-header row m-0 d-flex justify-content-between align-items-center ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <div className="col-12 col-md-2">
            <label className="" style={{ fontSize: "0.95rem" }}>
              Assessments per Page:
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
          <div className="col-12 col-lg-4 d-flex justify-content-md-end">
            <SearchBarContainer
              darkMode={darkMode}
              handleSearchValue={handleSearchValue}
              val={searchValue}
              placeHolder={"Search for an Assessment ..."}
            />
          </div>
        </div>
        <div
          className={`card-header row m-0 p-3 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <div className=" d-flex justify-content-center align-items-center ">
            <PaginationNav
              darkMode={darkMode}
              counts={assessmentsListCount}
              pageNo={pageNo}
              setPageNo={setPageNo}
              countPerPage={countPerPage}
            />
          </div>
        </div>
        <div
          className={`table-responsive text-nowrap ${
            darkMode ? "spic-dark-mode" : ""
          }`}
        >
          <table className="table">
            <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
              <tr>
                <th>#</th>
                <th>Title</th>
                {user.role === "Admin" ? <th>Creator</th> : ""}
                <th>Date</th>
                <th>Questions Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              <tr>
                <td>1</td>
                <td>
                  <strong>Angular Project</strong>
                </td>
                {user.role === "Admin" ? <td>Albert Cook</td> : ""}
                <td>2025-02-06</td>
                <td>
                  <span className="bg-label-primary text-primary me-1">15</span>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Link
                      to={`/company/assessment/${1}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => deleteAssessment(1234)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
