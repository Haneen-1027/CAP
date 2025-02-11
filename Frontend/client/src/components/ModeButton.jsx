import React from "react";

function DarkModeBtnContainer({ darkMode, toggleDarkMode }) {
  return (
    <div className="mode d-flex align-items-center">
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`btn ${darkMode ? " spic-dark-mode" : ""} p-0`}
        id="mode-btn"
      >
        <i
          className={`mx-2 ${
            darkMode ? "fa-solid fa-sun" : "fa-regular fa-moon"
          }`}
        ></i>
      </button>
    </div>
  );
}

export default DarkModeBtnContainer;
