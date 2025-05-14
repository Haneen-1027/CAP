import React, { useEffect, useState } from "react";

function Footer({ darkMode }) {
  return (
    <footer className={`p-1`}>
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item">
          <a
            href="#"
            className={` ${
              darkMode ? "text-light" : "text-body-secondary"
            } nav-link px-2 `}
          >
            Home
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={` ${
              darkMode ? "text-light" : "text-body-secondary"
            } nav-link px-2 `}
          >
            Features
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={` ${
              darkMode ? "text-light" : "text-body-secondary"
            } nav-link px-2 `}
          >
            Pricing
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={` ${
              darkMode ? "text-light" : "text-body-secondary"
            } nav-link px-2 `}
          >
            FAQs
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={` ${
              darkMode ? "text-light" : "text-body-secondary"
            } nav-link px-2 `}
          >
            About
          </a>
        </li>
      </ul>
      <p className="text-center ">© 2024 Company, Inc</p>
    </footer>
  );
}

export default Footer;
