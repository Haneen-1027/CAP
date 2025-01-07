import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Navbar({ values, userDetailes }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let [clickOnProfile, setClickOnProfile] = useState(false);
  let [navBarOpenHandle, setNavBarOpenHandle] = useState(false);

  function handaleProfileClick() {
    if (clickOnProfile) {
      setClickOnProfile(false);
    } else {
      setClickOnProfile(true);
    }
  }
  useEffect(() => {
    console.log("navBarOpenHandle: ", navBarOpenHandle);
    console.log("Navbar: ", values);
    console.log("Navbar, user: ", userDetailes);

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
        <div className="d-flex align-items-center">
          <div className="respo-nav">
            <button
              onClick={() => setNavBarOpenHandle(true)}
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
              className={`container-fluid collapse navbar-collapse nav-small-screns ${
                navBarOpenHandle ? "" : "d-none"
              }`}
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
                          nav-link text-dark ${val.text === "|" ? "d-flex" : ""}
                        `}
                        to={val.path}
                        onClick={() => setNavBarOpenHandle(false)}
                      >
                        {val.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {userDetailes && userDetailes.role !== "" ? (
            <div
              onClick={() => handaleProfileClick()}
              style={{ cursor: "pointer" }}
              className="position-relative nav-item justify-content-center align-items-center"
            >
              <div className="text-center nav-link position-relative m-0 mid-bold text-truncate">
                {userDetailes.firstName} {userDetailes.lastName}
              </div>
              <div
                className={`dropDawn navbar-nav position-absolute bg-white bottom-shadow d-flex flex-column justify-content-center align-items-center ${
                  clickOnProfile ? "" : "d-none"
                }`}
              >
                <Link
                  style={{ cursor: "pointer" }}
                  className={`position-relative nav-item nav-link mt-1 text-truncate `}
                  to={`/profile/${userDetailes.id}`}
                >
                  You Profile
                </Link>
                <a
                  style={{ cursor: "pointer" }}
                  className={`position-relative nav-item nav-link mb-3 text-truncate `}
                >
                  LogOut
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
}
