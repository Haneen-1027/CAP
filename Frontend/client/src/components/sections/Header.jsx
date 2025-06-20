import React, { useEffect } from "react";

import { Navbar } from "../../componentsLoader/ComponentsLoader";

function Header({ darkMode, userDetailes, logout }) {
  //NavBars
  const defaultNavBarValues = [
    { id: 1, text: "Home", path: "/home" },
    { id: 4, text: "Contact", path: "/contact" },
    { id: 0, text: "|", path: null },
    { id: 10, text: "Login", path: "/login" },
  ];
  //
  const adminNavBarValues = [
    { id: 1, text: "Home", path: "admin/home" },
    { id: 2, text: "Question Bank", path: "admin/questions_bank" },
    { id: 3, text: "Assessment", path: "/assessment" },
    { id: 4, text: "Users", path: "admin/users" },
    { id: 0, text: "|", path: null },
  ];
  //
  const contNavBarValues = [
    { id: 1, text: "Home", path: "/contributer/home" },
    { id: 2, text: "Assessments", path: "/contributer/assessments" },
    { id: 0, text: "|", path: null },
  ];
  //
  const compNavBarValues = [
    { id: 1, text: "Home", path: "/company/home" },
    { id: 2, text: "Assessment", path: "/assessment" },
    { id: 0, text: "|", path: null },
  ];

  useEffect(() => {
    console.log("Header.jsx: ", userDetailes?.role);
  }, []);

  /////////////////////////
  return (
    <header
      className={`${
        darkMode ? "spic-dark-mode" : "main-bg"
      } all-Mid-shadow w-100 sticky-top`}
    >
      <Navbar
        values={
          userDetailes.role === "Admin"
            ? adminNavBarValues
            : userDetailes.role === "Company"
            ? compNavBarValues
            : userDetailes.role === "Contributor"
            ? contNavBarValues
            : defaultNavBarValues
        }
        userDetailes={userDetailes}
        darkMode={darkMode}
        logout={logout}
      />
    </header>
  );
}

export default Header;
