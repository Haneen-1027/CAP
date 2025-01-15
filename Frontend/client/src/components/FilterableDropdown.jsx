import React, { useEffect, useState } from "react";

export default function FilterableDropdown({
  darkMode,
  filterType,
  items,
  handleFunction,
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
  }, []);
  ////////////////
  return (
    <div className="">
      <select
        className="p-2"
        style={{ width: "100%" }}
        onChange={(e) => handleEvent(e)}
      >
        <option value={0}>{filterType}</option>
        {items
          .filter((item) => item.name.toLowerCase().includes(filterText))
          .map((item, index) => (
            <option value={item.value} key={index} className="dropdown-item">
              {item.name}
            </option>
          ))}
      </select>
    </div>
  );
}
