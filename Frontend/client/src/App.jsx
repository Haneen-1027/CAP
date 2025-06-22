import React, { Suspense, useEffect, useState } from "react";
import { Footer, Header, Main } from "./componentsLoader/ComponentsLoader";

import { jwtDecode } from "jwt-decode";
import { useDarkMode } from "./Context/DarkMode";
import { useNavigate } from "react-router";

function App() {
  const { darkMode } = useDarkMode();
  let [activeId, setActiveId] = useState();
  const navigate = useNavigate();

  //login user details
  let [userDetailes, setUserDetails] = useState({});

  function setUserData() {
    let detailsString = localStorage.getItem("details");
    const details = JSON.parse(detailsString);
    setUserDetails(details);
  }

  /* log out: clear toke local storage, clear userDetails. */
  async function logout() {
    await localStorage.removeItem("token");
    await localStorage.removeItem("details");
    await setUserDetails({});
    navigate({
      pathname: "/login",
    });
  }

  /* goTo page */
  function goToPage() {
    setActiveId(1);
    navigate({
      pathname: `/`,
    });
  }
  ///////////////
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData();
    }
  }, []);
  useEffect(() => {
    console.log("userDetails", userDetailes);
  }, [userDetailes]);

  if (localStorage.getItem("token") && !userDetailes) {
    return (
      <div className="alert alert-danger text-center fs-3 p-4">
        500 - Server Error!
      </div>
    );
  } else
    return (
      <>
        <Suspense
          fallback={
            <div className="center-container d-flex justify-content-center align-items-center w-100 h-100">
              <div
                className="spinner-border text-success d-flex justify-content-center align-items-center"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          <div className="position-relative">
            {/* Header */}
            <Header
              userDetailes={userDetailes}
              darkMode={darkMode}
              logout={logout}
            />
            {/* Main */}
            <Main
              userDetailes={userDetailes}
              setUserData={setUserData}
              goToPage={goToPage}
              setActiveId={setActiveId}
              darkMode={darkMode}
            />
            {/* Footer */}
            <Footer darkMode={darkMode} />
          </div>
        </Suspense>
      </>
    );
}

export default App;
