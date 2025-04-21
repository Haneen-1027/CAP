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
export const NotFoundPath = lazy(() => import("../pages/Error/Error.jsx"));
export const AuthorizeError = lazy(() =>
  import("../pages/Error/AuthorizeError.jsx")
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
// Modals
export const LargeModal = lazy(() =>
  import("../components/LargeModal/LargeModal.jsx")
);
// Modals Content - Large
export const InviteContributors = lazy(() =>
  import("../components/LargeModal/ModalContent/InviteContributors.jsx")
);
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
export const SubmittedAssessment = lazy(() =>
  import(
    "../components/CompanyComponents/CorrectionAssessment/SubmittedAssessment.jsx"
  )
);
///////////////////////////////////////////////////////////
//// Assessments Components:
// Outlet
export const AssessmentOutlet = lazy(() =>
  import("../components/CompanyComponents/Assessment/AssessmentOutlet.jsx")
);
//Create Assessment
export const CreateAssessment = lazy(() =>
  import(
    "../components/CompanyComponents/Assessment/AddAssessment/CreateAssessment.jsx"
  )
);
//View Assessment
export const CompAssessment = lazy(() =>
  import(
    "../components/CompanyComponents/Assessment/ViewAssessment/CompAssessment.jsx"
  )
);
export const AssessmentsTableHeaders = lazy(() =>
  import(
    "../components/CompanyComponents/Assessment/ViewAssessment/viewAssessmentComponents/AssessmentsTableHeaders.jsx"
  )
);
export const RenderVisibleAssessments = lazy(() =>
  import(
    "../components/CompanyComponents/Assessment/ViewAssessment/viewAssessmentComponents/RenderVisibleAssessments.jsx"
  )
);
//Update Assessment
export const UpdateAssessment = lazy(() =>
  import(
    "../components/CompanyComponents/Assessment/UpdateAssessment/UpdateAssessment.jsx"
  )
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

// AttemptAssessment
export const AttemptAssessment = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/AttemptAssessment/AttemptAssessment.jsx"
  )
);

// Assessment Details
export const AssessmentDetails = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/AttemptAssessment/AssessmentDetails.jsx"
  )
);

// Assessment Questions "For Contributor to attempt"
export const AssessmentQuestions = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/AttemptAssessment/AssessmentQuestions.jsx"
  )
);

// MultipleChoice "to render mc questions for contributor to answer"
export const MultipleChoiceQuestion = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/AttemptAssessment/QuestionsRendering/MultipleChoice.jsx"
  )
);
// Coding "to render coding questions for contributor to answer"
export const CodingQuestion = lazy(() =>
  import(
    "../components/ContributerComponents/Assessments/AttemptAssessment/QuestionsRendering/CodingQuestion/CodingQuestion.jsx"
  )
);

/////////
// User Assessment Results
export const UserAssessmentResults = lazy(() =>
  import(
    "../components/ContributerComponents/Results/UserAssessmentResults .jsx"
  )
);
