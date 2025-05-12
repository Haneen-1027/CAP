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
  UserAssessmentResults,
  PreviewQuestion,
  CompAssessment,
  CreateAssessment,
  UpdateAssessment,
  AssessmentOutlet,
  AttemptAssessment,
  SubmittedAssessment,
  NotFoundPath,
  AuthorizeError,
  InviteContributors,
  AddUser,
  PreviewUsers,
  PreviewUser,
  AttemptsPreview,
} from "../../componentsLoader/ComponentsLoader";
import Admin from "../../pages/Admin/Admin";
import Company from "../../pages/Company/Company";

function Main({
  userDetailes,
  darkMode,
  setActiveId,
  goToPage,
  setUserData,
  logout,
}) {
  useEffect(() => {
    console.log("Main.jsx: ", userDetailes);
  }, []);
  return (
    <main className="container my-5">
      <Routes>
        {/*** General Path - "..domain.../your_path" ***/}
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              {userDetailes.role === "Admin" ? (
                <AdmDashboard darkMode={darkMode} />
              ) : userDetailes.role === "Company" ? (
                <CompDashboard darkMode={darkMode} />
              ) : userDetailes.role === "Contributor" ? (
                <ContDashboard darkMode={darkMode} />
              ) : (
                <LandingPage darkMode={darkMode} />
              )}
            </Suspense>
          }
        >
          {/* Home Componenet path: '/home' */}

          <Route
            path="/home"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                {userDetailes.role === "Admin" ? (
                  <AdmDashboard darkMode={darkMode} />
                ) : userDetailes.role === "Company" ? (
                  <CompDashboard darkMode={darkMode} />
                ) : userDetailes.role === "Contributor" ? (
                  <ContDashboard darkMode={darkMode} />
                ) : (
                  <LpHome darkMode={darkMode} />
                )}
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <LpLogin
                  darkMode={darkMode}
                  setUserData={setUserData}
                  goToPage={goToPage}
                  userDetails={userDetailes}
                  setActiveId={setActiveId}
                />
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
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
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              {" "}
              <Admin user={userDetailes} darkMode={darkMode} />{" "}
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
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
                        className="spinner-border text-success"
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
              path="/admin/questions_bank/update_question/:id"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-success"
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
                        className="spinner-border text-success"
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
            <Route
              path="/admin/questions_bank/preview/:id"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <PreviewQuestion darkMode={darkMode} />
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <UsersMain user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          >
            <Route
              path="/admin/users/preview"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <PreviewUsers user={userDetailes} darkMode={darkMode} />
                </Suspense>
              }
            />
            <Route
              path="/admin/users/add_user"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <AddUser user={userDetailes} darkMode={darkMode} />
                </Suspense>
              }
            />
            <Route
              path="/admin/users/preview_user/:id"
              element={
                <Suspense
                  fallback={
                    <div className="center-container">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                >
                  <PreviewUser darkMode={darkMode} />
                </Suspense>
              }
            />
          </Route>
        </Route>
        {/* Contributer Page */}
        <Route
          path="/contributer"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <Contributer user={userDetailes} darkMode={darkMode} />{" "}
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
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <ContDashboard
                  userDetailes={userDetailes}
                  darkMode={darkMode}
                />
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
                    <div className="spinner-border text-success" role="status">
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
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <AttemptAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* Contributer Result */}
          <Route
            path="/contributer/result"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <UserAssessmentResults
                  user={userDetailes}
                  darkMode={darkMode}
                />
              </Suspense>
            }
          />
        </Route>
        {/* Company Page */}
        <Route
          path="company"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <Company user={userDetailes} darkMode={darkMode} />
            </Suspense>
          }
        >
          {/*Company Dashboard */}
          <Route
            path="/company/home"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <CompDashboard user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* Company Correction Assessment */}
          <Route
            path="/company/submitted"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <SubmittedAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
        </Route>
        {/* Assessments Page */}
        <Route
          path="/assessment"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <AssessmentOutlet user={userDetailes} darkMode={darkMode} />
            </Suspense>
          }
        >
          {/* Add Assessment*/}
          <Route
            path="/assessment/add"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <CreateAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* Update Assessment*/}
          <Route
            path="/assessment/update/:id"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <CreateAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* view Assessment*/}
          <Route
            path="/assessment/view"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <CompAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
          {/* Update Assessment*/}
          <Route
            path="/assessment/:id"
            element={
              <Suspense
                fallback={
                  <div className="center-container">
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              >
                <UpdateAssessment user={userDetailes} darkMode={darkMode} />
              </Suspense>
            }
          />
        </Route>
        <Route
          path={`/InviteContributors/:id`}
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <InviteContributors darkMode={darkMode} user={userDetailes} />
            </Suspense>
          }
        ></Route>
        {/* Catch-all for unauthorized access */}
        {/* AuthorizeError Componenet path: '/AuthorizeError' */}
        <Route
          path="/AuthorizeError"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <AuthorizeError darkMode={darkMode} />
            </Suspense>
          }
        ></Route>
        <Route
          path="*"
          element={
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
              <NotFoundPath />
            </Suspense>
          }
        />{" "}
        {/** Tests */}
        <Route
          path="/test"
          element={
            <Suspense
              fallback={
                <div className="center-container">
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              <AttemptsPreview darkMode={darkMode} />
            </Suspense>
          }
        ></Route>
      </Routes>
    </main>
  );
}

export default Main;
