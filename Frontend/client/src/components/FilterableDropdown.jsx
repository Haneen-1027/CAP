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

  const handleFilterChange = (e) => {
    setFilterText(e.target.value.toLowerCase());
  };

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
    <select
      className={`p-2 ${darkMode ? " spic-dark-mode" : ""}`}
      style={{ width: "100%" }}
      onChange={(e) => handleEvent(e)}
      name={name}
      value={selectedValue ? selectedValue : 0}
      disabled={isDisabled}
    >
      {!noExtraOption ? <option value={0}>{filterType}</option> : ""}
      {items
        .filter((item) => item.name.toLowerCase().includes(filterText))
        .map((item, index) => (
          <option value={item.value} key={index} className="dropdown-item">
            {item.name}
          </option>
        ))}
    </select>
  );
}
