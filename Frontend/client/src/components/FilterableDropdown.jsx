import React, { useEffect, useState } from "react";

export default function FilterableDropdown({
  darkMode,
  filterType,
  items,
  handleFunction,
  name,
  selectedValue,
  isDisabled,
  noExtraOption,
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
    <div className="form-floating">
      {" "}
      <select
        className={`form-select ${darkMode ? " spic-dark-mode" : ""}`}
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
      <label for="floatingSelectGrid">
        {filterType ? filterType : "Select Option"}
      </label>
    </div>
  );
}
