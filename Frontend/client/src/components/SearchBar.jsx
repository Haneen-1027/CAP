import React, { useState } from "react";

function SearchBarContainer({ darkMode, handleSearchValue, val, placeHolder }) {
  const [inputValue, setInputValue] = useState(val || "");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchValue(inputValue); // Only update search value on Enter
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value); // Update local state only
  };

  return (
    <>
      <div className="search w-100 gap-1 d-flex flex-column flex-md-row flex-wrap justify-content-start justify-content-md-between g-4 g-md-0 align-items-md-center my-4">
        <div className={`input-group ${darkMode ? "" : "light"} bg-transparent`}>
          <div
            className={`w-100 border custome-search bg-white d-flex justify-content-start align-items-center ${
              darkMode ? "spic-dark-mode" : "light"
            }`}
          >
            <span
              className={`${
                darkMode ? " spic-dark-mode" : "light"
              } border-0 input-group-text bg-white p-4 `}
              style={{ fontFamily: "FontAwesome" }}
            >
              <i className="fas fa-search" />
            </span>
            <div className={`w-100 ${darkMode ? "dark-input " : ""}`} id="search-bar">
              <input
                onKeyDown={handleKeyDown}
                className={`form-control ${darkMode ? "spic-dark-mode " : ""} border-0`}
                id="floatingInputGroup1"
                type="search"
                placeholder={placeHolder ? placeHolder : "Search ..."}
                aria-label="Search"
                value={inputValue}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBarContainer;