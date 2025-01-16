import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router";

import {
  LandingPage,
  LpHome,
  LpAbout,
  LpFeatures,
  LpContact,
  LpLogin,
  LpSignup,
  AdmDashboard,
  CompDashboard,
  ContDashboard,
  QuestionsBankMain,
  ContactsMain,
  UsersMain,
  UserProfile,
  Contributer,
  Assessments,
  AddQuestion,
  ViewQuestions,
  QuestionAssessment,
} from "../../componentsLoader/ComponentsLoader";
import Admin from "../../pages/Admin/Admin";

function Main({ userDetailes, darkMode }) {
  useEffect(() => {
    console.log("Main.jsx: ", userDetailes.role);
  }, []);
  return (
    <main className="container my-5">
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <LandingPage user={userDetailes} darkMode={darkMode} />
            </Suspense>
          }
        >
          {/* Domain starts with : '/' */}
          <Route
            path="/"
            element={
              userDetailes.role === "Admin" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <AdmDashboard darkMode={darkMode} />
                </Suspense>
              ) : userDetailes.role === "Company" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <CompDashboard darkMode={darkMode} />
                </Suspense>
              ) : userDetailes.role === "Contributer" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <ContDashboard darkMode={darkMode} />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <LpHome darkMode={darkMode} />
                </Suspense>
              )
            }
          ></Route>
          {/* Home Componenet path: '/home' */}

          <Route
            path="/home"
            element={
              userDetailes.role === "Admin" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <AdmDashboard darkMode={darkMode} />
                </Suspense>
              ) : userDetailes.role === "Company" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <CompDashboard darkMode={darkMode} />
                </Suspense>
              ) : userDetailes.role === "Contributer" ? (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <ContDashboard darkMode={darkMode} />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <LpHome darkMode={darkMode} />
                </Suspense>
              )
            }
          ></Route>

          {/* About Componenet path: '/about' */}
          <Route
            path="/about"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpAbout darkMode={darkMode} />
              </Suspense>
            }
          ></Route>

          {/* Features Componenet path: '/features' */}
          <Route
            path="/features"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpFeatures darkMode={darkMode} />
              </Suspense>
            }
          ></Route>

          {/* Contact Componenet path: '/contact' */}
          <Route
            path="/contact"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpContact darkMode={darkMode} />
              </Suspense>
            }
          ></Route>

          {/* Login Componenet path: '/login' */}
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpLogin darkMode={darkMode} />
              </Suspense>
            }
          ></Route>

          {/* Signup Componenet path: '/signup' */}
          <Route
            path="/signup"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpSignup darkMode={darkMode} />
              </Suspense>
            }
          ></Route>
          {/* User Profile Componenet path: '/profile/:id' */}
          <Route
            path="/profile/:id"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <UserProfile userDetailes={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          ></Route>
        </Route>
        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <Admin user={userDetailes} darkMode={darkMode} />
            </Suspense>
          }
        >
          {/*Admin Dashboard */}
          <Route
            path="/admin/home"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <AdmDashboard user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/*Admin Questions Bank */}
          <Route
            path="/admin/questions_bank"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <QuestionsBankMain user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          >
            <Route
              path="/admin/questions_bank/add_question"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <AddQuestion user={userDetailes} darkMode={darkMode} />
                </Suspense>
              }
            />
            <Route
              path="/admin/questions_bank/preview"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <ViewQuestions user={userDetailes} darkMode={darkMode} />
                </Suspense>
              }
            />
          </Route>
          {/*Admin Contacts */}
          <Route
            path="/admin/contacts"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <ContactsMain user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/*Admin Users */}
          <Route
            path="/admin/users"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <UsersMain user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
        </Route>
        {/* Contributer Page */}
        <Route
          path="/contributer"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <Contributer user={userDetailes} darkMode={darkMode} />
            </Suspense>
          }
        >
          {/*Contributer Dashboard */}
          <Route
            path="/contributer/home"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <ContDashboard userDetailes={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* Contributer Assessments */}
          <Route
            path="/contributer/assessments"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <Assessments user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />

          {/* Contributer Qusetion related to Assessments */}
          <Route
            path="/contributer/assessments/:id"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <QuestionAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default Main;
