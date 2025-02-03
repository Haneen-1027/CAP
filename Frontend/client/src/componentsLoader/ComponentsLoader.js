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
export const Admin = lazy(() => import("../pages/Admin/Admin.jsx"));
export const Company = lazy(() => import("../pages/Company/Company.jsx"));
export const Contributer = lazy(() =>
  import("../pages/Contributer/Contributer.jsx")
);

/*==========================================  Componenets ===========*/
// Navbar Component
export const Navbar = lazy(() => import("../components/Navbar/Navbar.jsx"));
// Sub Navbar
export const SubNavbar = lazy(() => import("../components/SubNavbar.jsx"));
// Paganation Nav
export const PaginationNav = lazy(() =>
  import("../components/PaginationNav.jsx")
);
// FilterableDropdown
export const FilterableDropdown = lazy(() =>
  import("../components/FilterableDropdown.jsx")
);
// Back Button
export const BackBtn = lazy(() => import("../components/BackBtn.jsx"));

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
// User Profile
export const UserProfile = lazy(() =>
  import("../components/UserPofile/UserProfile.jsx")
);
// Mode Button
export const ModeButton = lazy(() => import("../components/ModeButton.jsx"));
///////////////////////////////////////////////////////////
//// Admin Page Components:
export const AdmDashboard = lazy(() =>
  import("../components/AdminComponents/AdmDashboard.jsx")
);
export const QuestionsBankMain = lazy(() =>
  import("../components/AdminComponents/QuestionsBank/QuestionsBank.jsx")
);
export const AddQuestion = lazy(() =>
  import(
    "../components/AdminComponents/QuestionsBank/AddQuestion/AddQuestion.jsx"
  )
);
export const MultipleChoice = lazy(() =>
  import(
    "../components/AdminComponents/QuestionsBank/AddQuestion/MultipleChoice.jsx"
  )
);
export const Coding = lazy(() =>
  import("../components/AdminComponents/QuestionsBank/AddQuestion/Coding.jsx")
);
export const ViewQuestions = lazy(() =>
  import(
    "../components/AdminComponents/QuestionsBank/ViewQuestions/ViewQuestions.jsx"
  )
);
export const PreviewQuestion = lazy(() =>
  import(
    "../components/AdminComponents/QuestionsBank/ViewQuestions/PreviewQuestion.jsx"
  )
);
export const ContactsMain = lazy(() =>
  import("../components/AdminComponents/Contacts/Contacts.jsx")
);
export const UsersMain = lazy(() =>
  import("../components/AdminComponents/Users/Users.jsx")
);
///////////////////////////////////////////////////////////
//// Company Page Components:
export const CompDashboard = lazy(() =>
  import("../components/CompanyComponents/CompDashboard.jsx")
);
//Create Assessment
export const CreateAssessment = lazy(() =>
  import("../components/CompanyComponents/Assessment/AddAssessment/CreateAssessment.jsx")
);
//View Assessment
export const CompAssessment = lazy(() =>
  import("../components/CompanyComponents/Assessment/ViewAssessment/CompAssessment.jsx")
);
//Update Assessment
export const UpdateAssessment = lazy(() =>
  import("../components/CompanyComponents/Assessment/UpdateAssessment/UpdateAssessment.jsx")
);
///////////////////////////////////////////////////////////
//// Contributer Page Components:
export const ContDashboard = lazy(() =>
  import("../components/ContributerComponents/ContDashboard.jsx")
);
// Assessments
export const Assessments = lazy(() =>
  import("../components/ContributerComponents/Assessments/Assessments.jsx")
);
// Question related to Assessments
export const QuestionAssessment = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/QuestionAssessment.jsx"
  )
);
// User Assessment Results
export const UserAssessmentResults = lazy(() =>
  import(
    "../components/ContributerComponents/Results/UserAssessmentResults .jsx"
  )
);
