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
  /* get user token and decode it */
  function setUserData() {
    let token = localStorage.getItem("token");
    let decodeData = jwtDecode(token);
    setUserDetails(decodeData);
  }

  /* log out: clear toke local storage, clear userDetails. */
  function logout() {
    localStorage.removeItem("token");
    setUserDetails({});
    navigate({
      pathname: "/Login",
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
        {/* Header */}
        <Header userDetailes={userDetailes} darkMode={darkMode} />
        {/* Main */}
        <Main
          userDetailes={userDetailes}
          setUserData={setUserData}
          goToPage={goToPage}
          logout={logout}
          setActiveId={setActiveId}
          darkMode={darkMode}
        />
        {/* Footer */}
        <Footer darkMode={darkMode} />
      </Suspense>
    </>
  );
}

export default App;
