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
export const Navbar = lazy(() => import("../components/Navbar.jsx"));
