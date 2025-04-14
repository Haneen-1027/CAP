import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useDarkMode } from "../Context/DarkMode";

export default function SubNavbar({ values }) {
  let [activeId, setActiveId] = useState();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    console.log(activeId);
  }, [activeId]);
  return (
    <nav
      className={`${
        darkMode ? " spic-dark-mode" : ""
      } navbar bg-white w-sm-50 navbar-expand-lg mb-4 border`}
      id="nav"
    >
      <div className="container d-flex justify-content-sm-center ">
        <ul className="navbar-nav flex-column flex-sm-row mb-2 mb-lg-0 gap-2 gap-sm-4">
          {values.map((val, index) => (
            <li
              key={index}
              className="nav-item"
              onClick={() => setActiveId(val.id)}
            >
              <Link
                className={`${
                  activeId === val.id ? "nav-link active" : "nav-link"
                } ${darkMode ? " spic-dark-mode border-0" : ""} text-truncate`}
                to={val.path}
              >
                {val.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
