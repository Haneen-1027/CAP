import React, { useEffect, useState } from "react";

export default function FilterableDropdown({
  darkMode,
  filterType,
  items,
  handleFunction,
  name,
  selectedValue,
  isDisabled,
}) {
  const [filterText, setFilterText] = useState("");

  const handleEvent = (e) => {
    console.log(e.target.value);
    handleFunction(e);
  };
  /////////////////
  useEffect(() => {
    //console.log("DropDown Select menue: ", items);
    console.log("SelectedValue =  ", selectedValue);
  }, []);
  ////////////////
  return (
    <div className="form-floating" style={{ width: "100%" }}>
      {" "}
      <select
        className={`form-select ${darkMode ? " spic-dark-mode" : ""} w-100`}
        id="floatingSelectGrid"
        style={{ width: "100%" }}
        onChange={(e) => handleEvent(e)}
        name={name}
        value={selectedValue ? selectedValue : 0}
        disabled={isDisabled ? isDisabled : false}
      >
        {items
          .filter((item) => item.name.toLowerCase().includes(filterText))
          .map((item, index) => (
            <option value={item.value} key={index} className="dropdown-item">
              {item.name}
            </option>
          ))}
      </select>{" "}
      <label
        style={{ color: `${darkMode ? "#ccc" : ""}` }}
        for="floatingSelectGrid"
      >
        {filterType ? filterType : "Select Option"}
      </label>
    </div>
  );
}
