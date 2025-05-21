import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  BackBtn,
  FilterableDropdown,
  SearchBar,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";

import attempts from "./Attempts.json";
import { CalculateTimeInMinutes } from "../../../../Utils/CalculateTimeInMinutes";

export default function AttemptsPreview({ darkMode }) {
  // Component States
  // const [attempts, setAttempts] = useState([]);
  const { assessment_id } = useParams();

  // Searching
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Filteration
  const items = [
    { name: "All", value: -999 },
    { name: "Completed", value: 1 },
    { name: "In Review", value: 99 },
    { name: "Not Started", value: -1 },
  ];
  const [status, setStatus] = useState(0);

  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [attemptsCount, setAttemptsCount] = useState(10);
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);

  // Loading & Error
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Error message
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
  // Loading message
  const loadingMessage = (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  ////////////////////////

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const calculateTotalMark = (answers) => {
    console.log(answers);
    let new_mark = 0;
    answers.forEach((answer, index) => {
      console.log(
        "answer.new_mark: ",
        answer.new_mark,
        " and it's type is: ",
        typeof answer.new_mark
      );
      new_mark += parseInt(answer.new_mark);
    });
    return new_mark;
  };

  // Search => Filteration
  const visiblList = useMemo(() => {
    return attempts;
  }, [attempts, searchValue, status]);

  // Render Final Attempts List
  const renderList = () => {
    return visiblList.map((attempt, index) => {
      if (attempt.assessment_id == assessment_id) {
        const start_time = attempt.started_time.split("T")[1];
        const submited_time = attempt.submitted_time.split("T")[1];

        return (
          <tr key={index}>
            <td>{index < 10 ? "0" + (index + 1) : index + 1}</td>
            <td>@{attempt.username}</td>
            <td>{attempt.firstName + " " + attempt.lastName}</td>
            <td>
              {start_time.slice(0, start_time.lastIndexOf(":"))}
              {start_time.slice(0, start_time.lastIndexOf(":")).split(":")[0] <
              12
                ? " AM"
                : " PM"}
            </td>
            <td>
              {" "}
              {submited_time.slice(0, submited_time.lastIndexOf(":"))}{" "}
              {submited_time
                .slice(0, submited_time.lastIndexOf(":"))
                .split(":")[0] < 12
                ? " AM"
                : " PM"}
            </td>
            <td>{CalculateTimeInMinutes(submited_time, start_time)} min</td>
            <td>
              {calculateTotalMark(attempt.Answers) < 0
                ? "Incomplete"
                : calculateTotalMark(attempt.Answers)}
            </td>
            <td>
              <div className="d-flex gap-2 justify-content-center">
                <Link
                  to={`/attempts/${assessment_id}/${index}/evaluation`}
                  className="btn btn-sm btn-success"
                  title="Invite Contributors"
                >
                  <i className="fas fa-edit"></i>
                </Link>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </td>{" "}
          </tr>
        );
      }
    });
  };

  ////////////////////////
  useEffect(() => {
    console.log("Attempts visible list: ", visiblList);
  }, [visiblList]);

  ////////////////////////

  if (loading) {
    return loadingMessage;
  } else if (apiError) {
    return apiErrorMessage;
  } else
    return (
      <>
        <BackBtn />
        <div className={`card my-4 ${darkMode ? " spic-dark-mode" : ""}`}>
          {/** Header */}
          <div
            className={`card-header p-3 d-flex flex-column flex-md-row justify-content-between align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            {" "}
            <h1 className="h5">
              <strong>Completed Attempts:</strong>
            </h1>
            <Link
              to={`/assessment/123`}
              type="button"
              className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
                darkMode ? " spic-dark-mode" : ""
              }`}
            >
              <i className="fas fa-edit me-2"></i>
              Edit Assessment
            </Link>{" "}
          </div>
          {/** Search & Fillteration */}
          <div
            className={`card-header p-3 d-flex flex-column flex-md-row justify-content-between align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            <div className="col-12 col-md-6 col-lg-4">
              <SearchBar
                handleSearchValue={handleSearchValue}
                val={searchValue}
              />
            </div>
            <div className="col-12 col-md-3 col-lg-2">
              <FilterableDropdown
                items={items}
                handleFunction={handleStatus}
                selectedValue={status}
                filterType={"Select Status:"}
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
                counts={attemptsCount}
                pageNo={pageNo}
                setPageNo={setPageNo}
                countPerPage={countPerPage}
              />
            </div>
          </div>
          {/** Table Content */}
          <div
            className={`table-responsive text-nowrap ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            {" "}
            <table
              className={`table ${darkMode ? "table-dark " : "table-light"}`}
            >
              <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
                <tr>
                  {" "}
                  <th>#</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Started At</th>
                  <th>Completed At</th>
                  <th title="Total taken time - in minutes -">Total Time</th>
                  <th title="">Mark Earned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">{renderList()}</tbody>
            </table>
          </div>
        </div>
      </>
    );
}
