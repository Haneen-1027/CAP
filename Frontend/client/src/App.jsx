import React, { Suspense, useEffect, useState } from "react";
import { Footer, Header, Main } from "./componentsLoader/ComponentsLoader";

import { jwtDecode } from "jwt-decode";
import { useDarkMode } from "./Context/DarkMode";

function App() {
  const { darkMode } = useDarkMode();
  let [userDetailes, setUserDetails] = useState({
    id: "1234560",
    firstName: "Mena",
    lastName: "Admin",
    email: "Admin@gmail.com",
    bio: "Software developer with a passion for coding and learning.",
    role: "Company",
  });

  useEffect(() => {
    console.log("App.jsx: ", userDetailes);
  }, []);

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
        <Main userDetailes={userDetailes} darkMode={darkMode} />
        {/* Footer */}
        <Footer darkMode={darkMode} />
      </Suspense>
    </>
  );
}

export default App;
