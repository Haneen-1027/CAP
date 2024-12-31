import React, { Suspense, useEffect, useState } from "react";
import { Footer, Header, Main } from "./componentsLoader/ComponentsLoader";

import { jwtDecode } from "jwt-decode";

function App() {
  let userDetailes = useState({
    role: "Admin",
  });

  useEffect(() => {
    console.log("App.jsx: ", userDetailes.role);
  }, []);

  return (
    <>
      {/* Header */}
      <Suspense
        fallback={
          <div className="center-container">
            <div
              className="spinner-border text-primary d-flex justify-content-center align-items-center"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        <Header userDetailes={userDetailes[0]} />
      </Suspense>

      {/* Main */}
      <Suspense
        fallback={
          <div className="center-container">
            <div
              className="spinner-border text-primary d-flex justify-content-center align-items-center"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        <Main userDetailes={userDetailes[0]} />
      </Suspense>

      {/* Footer */}
      <Suspense
        fallback={
          <div className="center-container">
            <div
              className="spinner-border text-primary d-flex justify-content-center align-items-center"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
