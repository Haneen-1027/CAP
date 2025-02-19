import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AssessmentsTableHeaders,
  RenderVisibleAssessments,
} from "../../../../componentsLoader/ComponentsLoader";
import assessments from "./assessmentTest.json";

export default function CompAssessment({ user, darkMode }) {
  //////////
  const [showSchdAssessments, setShowSchdAssessments] = useState(true);
  const [visibleList, setVisibleList] = useState([]);
  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCounPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [assessmentsListCount, setAssessmentsListCount] = useState(15); // Calculated after get questions from API for Pagination
  // Searching
  const [searchValue, setSearchValue] = useState("");
  let [searchResults, setSearchResults] = useState([]);

  const [timeFilteration, setTimeFilteration] = useState({
    start_date: "2024-01-01",
    end_date: "2025-12-08",
  });
  //////////
  // Pagination Functions
  function handleCountPerPageMenu(e) {
    setCounPerPage(e.target.value);
  }
  function clearResults() {}

  //
  function handleDateFilter(e) {
    const { name, value } = e.target;
    setTimeFilteration((prevFilter) => ({ ...prevFilter, [name]: value }));
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
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "yyyy-mm-dd" format
    if (showSchdAssessments) {
      const visbAssessments = assessments.filter(
        (asses) => asses.time > currentDate
      );
      setVisibleList(visbAssessments);
    } else {
      const visbAssessments = assessments.filter(
        (asses) => asses.time < currentDate
      );
      setVisibleList(visbAssessments);
    }
  }, [showSchdAssessments]);

  useEffect(() => {
    console.log("Filteration: ", timeFilteration);
  }, [timeFilteration]);
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
            <strong>
              {showSchdAssessments ? "Scheduled" : "Completed"} Assessments:
            </strong>
          </h5>
          <Link
            to="/assessment/add"
            type="button"
            className={`btn btn-light btn-sm d-flex align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Assessment
          </Link>
        </div>
        <AssessmentsTableHeaders
          darkMode={darkMode}
          countPerPage={countPerPage}
          handleCountPerPageMenu={handleCountPerPageMenu}
          countPerPageValues={countPerPageValues}
          handleSearchValue={handleSearchValue}
          searchValue={searchValue}
          timeFilteration={timeFilteration}
          handleDateFilter={handleDateFilter}
          assessmentsListCount={assessmentsListCount}
          pageNo={pageNo}
          setPageNo={setPageNo}
          showSchdAssessments={showSchdAssessments}
          setShowSchdAssessments={setShowSchdAssessments}
        />
        <RenderVisibleAssessments
          darkMode={darkMode}
          assessments={visibleList}
          role={user.role}
          deleteAssessment={deleteAssessment}
          timeFilteration={timeFilteration}
        />
      </div>
    </>
  );
}
