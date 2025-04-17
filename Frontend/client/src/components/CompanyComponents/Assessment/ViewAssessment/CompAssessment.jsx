import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AssessmentsTableHeaders,
  RenderVisibleAssessments,
} from "../../../../componentsLoader/ComponentsLoader";
import { getAllAssessments, deleteAssessment as deleteAssessmentAPI } from "../../../../APIs/ApisHandaler";

export default function CompAssessment({ user, darkMode }) {
  const [assessments, setAssessments] = useState([]);
  const [showSchdAssessments, setShowSchdAssessments] = useState(true);
  const [visibleList, setVisibleList] = useState([]);
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [assessmentsListCount, setAssessmentsListCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [curDate, setCurDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeFilteration, setTimeFilteration] = useState({
    start_date: "2024-01-01",
    end_date: "2025-12-08",
  });

  const countPerPageValues = [10, 15, 25, 50, 75, 100];

  const getAssessments = async () => {
    try {
      const response = await getAllAssessments();
      if (Array.isArray(response.data)) {
        setAssessments(response.data);
        setAssessmentsListCount(response.data.length);
        filterAssessments(response.data, showSchdAssessments);
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

  const filterAssessments = (assessmentsToFilter, showUpcoming) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const filtered = assessmentsToFilter.filter((asses) =>
      showUpcoming ? asses.time >= currentDate : asses.time < currentDate
    );
    setVisibleList(filtered);
  };

  const handleCountPerPageMenu = (e) => {
    setCountPerPage(Number(e.target.value));
  };

  const handleSearchValue = (value) => {
    if (value.trim() === "") {
      setSearchResults([]);
      setSearchValue(value);
    } else {
      setSearchValue(value);
    }
  };

  const handleDateFilter = (e) => {
    const { name, value } = e.target;
    setTimeFilteration((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleDeleteAssessment = async (id) => {
    try {
      await deleteAssessmentAPI(id);
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
      console.log("Assessment deleted successfully");
    } catch (error) {
      console.error("Failed to delete assessment:", error);
    }
  };

  useEffect(() => {
    getAssessments();
  }, []);

  useEffect(() => {
    if (Array.isArray(assessments)) {
      filterAssessments(assessments, showSchdAssessments);
    }
  }, [showSchdAssessments, assessments]);

  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        <div
          className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
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
            className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
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
          deleteAssessment={handleDeleteAssessment}
          timeFilteration={timeFilteration}
          currentDate={curDate}
          isUpComing={showSchdAssessments}
        />
      </div>
    </>
  );
}