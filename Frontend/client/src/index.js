import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "./Context/DarkMode";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DarkModeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DarkModeProvider>
);
