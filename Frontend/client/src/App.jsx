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
      <Suspense
        fallback={
          <div className="center-container d-flex justify-content-center align-items-center">
            <div
              className="spinner-border text-primary d-flex justify-content-center align-items-center"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        {/* Header */}
        <Header userDetailes={userDetailes[0]} />
        {/* Main */}
        <Main userDetailes={userDetailes[0]} />
        {/* Footer */}
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
