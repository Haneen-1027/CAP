import React, { useState } from "react";

export default function FilterableDropdown({ darkMode, items }) {
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = (event) => {
    setFilterText(event.target.value.toLowerCase());
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Choose Category
        <span className="caret"></span>
      </button>
      <ul className="dropdown-menu p-2" style={{ width: "100%" }}>
        <input
          className="form-control mb-2"
          id="filterInput"
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={handleFilterChange}
        />
        {items
          .filter((item) => item.toLowerCase().includes(filterText))
          .map((item, index) => (
            <li key={index}>
              <a className="dropdown-item" href="#">
                {item}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
