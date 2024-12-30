import { lazy } from "react";

/*==========================================  Main Sections ===========*/
// Header
export const Header = lazy(() => import("../components/sections/Header.jsx"));

// Main
export const Main = lazy(() => import("../components/sections/Main.jsx"));

// Footer
export const Footer = lazy(() => import("../components/sections/Footer.jsx"));

/*==========================================  Pages ===========*/
export const LandingPage = lazy(() =>
  import("../pages/LandingPage/LandingPage.jsx")
);

/*==========================================  Componenets ===========*/
// Navbar Component
export const Navbar = lazy(() => import("../components/Navbar/Navbar.jsx"));

//// Landing Page Components:
// Home
export const LpHome = lazy(() =>
  import("../components/landingPageComponents/Home.jsx")
);
// About
export const LpAbout = lazy(() =>
  import("../components/landingPageComponents/About.jsx")
);
// Features
export const LpFeatures = lazy(() =>
  import("../components/landingPageComponents/Features.jsx")
);
// Contact
export const LpContact = lazy(() =>
  import("../components/landingPageComponents/Contact.jsx")
);
// Login
export const LpLogin = lazy(() =>
  import("../components/landingPageComponents/Login.jsx")
);
// Signup
export const LpSignup = lazy(() =>
  import("../components/landingPageComponents/Signup.jsx")
);
