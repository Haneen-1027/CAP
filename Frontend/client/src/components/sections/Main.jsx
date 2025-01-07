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
} from "../../componentsLoader/ComponentsLoader";
import Admin from "../../pages/Admin/Admin";

function Main({ userDetailes }) {
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
              <LandingPage user={userDetailes} />
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
                  <AdmDashboard />
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
                  <CompDashboard />
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
                  <ContDashboard />
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
                  <LpHome />
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
                  <AdmDashboard />
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
                  <CompDashboard />
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
                  <ContDashboard />
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
                  <LpHome />
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
                <LpAbout />
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
                <LpFeatures />
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
                <LpContact />
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
                <LpLogin />
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
                <LpSignup />
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
                <UserProfile userDetailes={userDetailes} />
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
              <Admin user={userDetailes} />
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
                <AdmDashboard user={userDetailes} />
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
                <QuestionsBankMain user={userDetailes} />
              </Suspense>
            }
          />
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
                <ContactsMain user={userDetailes} />
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
                <UsersMain user={userDetailes} />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default Main;
