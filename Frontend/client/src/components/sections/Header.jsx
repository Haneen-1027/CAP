import React, { useEffect } from "react";

import { Navbar } from "../../componentsLoader/ComponentsLoader";

function Header({ userDetailes }) {
  //NavBars
  const defaultNavBarValues = [
    { id: 1, text: "Home", path: "/home" },
    { id: 2, text: "About", path: "/about" },
    { id: 3, text: "Features", path: "/features" },
    { id: 4, text: "Contact", path: "/contact" },
    { id: 0, text: "|", path: null },
    { id: 10, text: "Login", path: "/login" },
  ];
  useEffect(() => {
    console.log("Header.jsx: ", userDetailes.role);
  }, []);

  /////////////////////////
  return (
    <header className="main-bg all-Mid-shadow position-relative w-100">
      <Navbar values={defaultNavBarValues} />
    </header>
  );
}

export default Header;
