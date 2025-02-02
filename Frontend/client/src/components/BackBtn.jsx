import React from "react";
import { useNavigate } from "react-router-dom";

import { useDarkMode } from "../Context/DarkMode";

export default function BackBtn() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div
      className={`back btn bg-transparent all-light-shadow border border-dark ${
        darkMode ? " spic-dark-mode border-0" : ""
      }`}
    >
      <button
        onClick={() => goBack()}
        className={`border-0 bg-transparent ${
          darkMode ? " spic-dark-mode border-0" : ""
        }`}
      >
        <i
          className={`fa fa-long-arrow-left mx-1 ${
            darkMode ? " spic-dark-mode border-0" : ""
          }`}
          aria-hidden="true"
        />
        Back
      </button>
    </div>
  );
}
