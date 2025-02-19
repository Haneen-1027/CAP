import React from "react";
import { PaginationNav } from "../../../../../componentsLoader/ComponentsLoader";
import SearchBarContainer from "../../../../SearchBar";

export default function AssessmentsTableHeaders({
  darkMode,
  countPerPage,
  handleCountPerPageMenu,
  countPerPageValues,
  handleSearchValue,
  searchValue,
  timeFilteration,
  handleDateFilter,
  assessmentsListCount,
  pageNo,
  setPageNo,
  showSchdAssessments,
  setShowSchdAssessments,
}) {
  return (
    <>
      {" "}
      {/** Count per Page & Search & Filteration */}
      <div
        className={`card-header row m-0 d-flex justify-content-between align-items-center ${
          darkMode ? " spic-dark-mode" : ""
        }`}
      >
        <div className="col-12 row m-0 align-items-center">
          <div className="col-12 col-lg-2">
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
          <div className="col-12 col-lg-10 d-flex justify-content-center justify-content-lg-end align-items-center gap-2">
            <input
              type="checkbox"
              value={!showSchdAssessments}
              onChange={() => setShowSchdAssessments(!showSchdAssessments)}
            />
            <label>Show Completed Assessments</label>
          </div>
        </div>

        <div className="col-12 row m-0">
          {" "}
          <div className="col-12 col-lg-6">
            <SearchBarContainer
              darkMode={darkMode}
              handleSearchValue={handleSearchValue}
              val={searchValue}
              placeHolder={"Search for an Assessment ..."}
            />
          </div>
          <div className="col-12 col-lg-6 row m-0 justify-content-end align-items-center">
            <div className="form-group col-12 col-md-6">
              <label htmlFor="">From:</label>
              <input
                type="date"
                className="form-control"
                id="start_date"
                name="start_date"
                value={timeFilteration.start_date}
                onChange={(e) => handleDateFilter(e)}
              />
            </div>
            <div className="form-group  col-12 col-md-6">
              <label htmlFor="">To:</label>
              <input
                type="date"
                className="form-control"
                id="end_date"
                name="end_date"
                value={timeFilteration.end_date}
                onChange={(e) => handleDateFilter(e)}
              />
            </div>
          </div>
        </div>
      </div>
      {/** Pagination Navbar */}
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
    </>
  );
}
