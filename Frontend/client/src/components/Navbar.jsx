import React, { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Navbar({ values }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav
      className={"main-bg general-nav navbar navbar-expand-lg w-100"}
      id="nav"
    >
      <div className="d-flex nav-xsmall-screens align-items-center justify-content-center  justify-content-md-between mx-4 w-100">
        <div className="">
          <Link className={`navbar-brand light  text-dark mid-bold`} to="/">
            <span className="primary-button-color">Coding</span>
            Assessment
          </Link>
        </div>
        <div className="d-flex ">
          <div className="respo-nav">
            <button
              className="navbar-toggler mx-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className={"navbar-toggler-icon"} />
            </button>
            <div
              className="container-fluid collapse navbar-collapse nav-small-screns"
              id="navbarSupportedContent"
            >
              <ul className={"navbar-nav ms-auto mb-2 mb-lg-0 "}>
                {values.map((val, index) => (
                  <li key={index} className="nav-item">
                    {val.text === "|" ? (
                      <div
                        className={`nav-span d-none d-lg-flex justify-content-center align-items-center `}
                      >
                        <span>{val.text}</span>
                      </div>
                    ) : (
                      <Link
                        style={{
                          display:
                            windowWidth < 742 && val.text === "|"
                              ? "none"
                              : "block",
                          transition:
                            windowWidth < 742 && val.text === "|" ? "0s" : "",
                        }}
                        className={`
                          nav-link text-dark
                        `}
                        to={val.path}
                      >
                        {val.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
