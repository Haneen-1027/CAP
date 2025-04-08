import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AssessmentsTableHeaders,
  RenderVisibleAssessments,
} from "../../../../componentsLoader/ComponentsLoader";
import { getAllAssessments } from "../../../../APIs/ApisHandaler";
// import assessments from "./assessmentTest.json";

export default function CompAssessment({ user, darkMode }) {
  const [assessments, setAssessments] = useState([]);
  
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

  //
  const [curDate, setCurDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [timeFilteration, setTimeFilteration] = useState({
    start_date: "2024-01-01",
    end_date: "2025-12-08",
  });
  //////////
  // const getAssessments = async () => {
  //   try {
  //     const response = await getAllAssessments();
  //     console.log("All assessments:", response.data);
  //     if (Array.isArray(response.data)) {
  //       setAssessments(response.data);
  //       setAssessmentsListCount(response.data.length);
  //       // Immediately update visibleList based on initial filter
  //       filterAssessments(response.data, showSchdAssessments);
  //     } else {
  //       console.error("API did not return an array:", response.data);
  //       setAssessments([]);
  //       setVisibleList([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching assessments:", error);
  //     setAssessments([]);
  //     setVisibleList([]);
  //   }
  // };


  const getAssessments = async () => {
    try {
      const response = await getAllAssessments();
      console.log("All assessments:", response.data);
      if (Array.isArray(response.data)) {
        setAssessments(response.data);
        setAssessmentsListCount(response.data.length);
        setVisibleList(response.data); 
      } else {
        console.error("API did not return an array:", response.data);
        setAssessments([]);
        setVisibleList([]);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      setVisibleList([]);
    }
  };
  

  // Helper function to filter assessments
  const filterAssessments = (assessmentsToFilter, showUpcoming) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const filtered = assessmentsToFilter.filter(asses => 
      showUpcoming ? asses.time >= currentDate : asses.time < currentDate
    );
    setVisibleList(filtered);
  };

  // Fetch questions when the component mounts
  // useEffect(() => {
  //   getAssessments();
  //   console.log("All assessments",getAllAssessments);
  // }, []);

  useEffect(() => {
    getAssessments();
  }, []);

  
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
    const currentDate = new Date().toISOString().split("T")[0];
    if (Array.isArray(assessments)) {  
      if (showSchdAssessments) {
        const visbAssessments = assessments.filter(
          (asses) => asses.time >= currentDate
        );
        setVisibleList(visbAssessments);
      } else {
        const visbAssessments = assessments.filter(
          (asses) => asses.time < currentDate
        );
        setVisibleList(visbAssessments);
      }
    }
  }, [showSchdAssessments, assessments]);  

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
              {showSchdAssessments ? "UpComing" : "Completed"} Assessments:
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
          currentDate={curDate}
          isUpComing={showSchdAssessments}
        />
      </div>
    </>
  );
}
