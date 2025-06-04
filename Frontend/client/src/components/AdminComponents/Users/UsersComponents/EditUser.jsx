import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserByID, updateUser } from "../../../../APIs/ApisHandaler";
import {
  BackBtn,
  FilterableDropdown,
} from "../../../../componentsLoader/ComponentsLoader";

export default function EditUser({ darkMode }) {
  const { id } = useParams();
  const roles = [
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];

  const [user, setUser] = useState({});

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const onSubmit = async () => {
    setIsLoading(true);
    setApiError(false);
    console.log("user befor submitting: ", user);
    try {
      await updateUser(id, user);
    } catch (e) {
      setApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setApiError(false);
      setIsLoading(true);
      try {
        const userData = await getUserByID(id);
        console.log("userData: ", userData);
        setUser(userData.data);
        setIsLoading(false);
        console.log("user: ", user);
      } catch (e) {
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="alert alert-danger">
        503 Error! Please wait for us to solve the problem.
      </div>
    );
  }

  return (
    <>
      <BackBtn />
      <form onSubmit={onSubmit}>
        <div className={`card ${darkMode ? "spic-dark-mode" : ""} my-4`}>
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-4 ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <h1 className="h5 text-center mb-0">
              <strong>Add User:</strong>
            </h1>
          </div>

          {/* Name Section */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-3 ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <div className="col-12 col-md-5 row m-0 justify-content-between">
              <div className="col-12 col-md-5 form-floating p-0">
                <input
                  type="text"
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  } ${darkMode ? "spic-dark-mode" : ""}`}
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={handleChanges}
                />
                <label htmlFor="firstName">First Name</label>
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="col-12 col-md-5 form-floating my-2 m-md-0 p-0">
                <input
                  type="text"
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  } ${darkMode ? "spic-dark-mode" : ""}`}
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={handleChanges}
                />
                <label htmlFor="lastName">Last Name</label>
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-5 form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                } ${darkMode ? "spic-dark-mode" : ""}`}
                id="username"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={handleChanges}
              />
              <label htmlFor="username">Username</label>
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
          </div>

          {/* Email, DOB, Role Section */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-3 ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <div className="col-12 col-md-5 form-floating p-0">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""} ${
                  darkMode ? "spic-dark-mode" : ""
                }`}
                id="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChanges}
              />
              <label htmlFor="email">Email</label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="col-12 col-md-5 row m-0 justify-content-between">
              <div className="col-12 col-md-5 form-floating p-0 my-2 m-md-0">
                <input
                  type="date"
                  className={`form-control ${
                    errors.dateOfBirth ? "is-invalid" : ""
                  } ${darkMode ? "spic-dark-mode text-light" : ""}`}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={user.dateOfBirth.split("T")[0]}
                  onChange={handleChanges}
                />
                <label
                  style={{ color: `${darkMode ? "#ccc" : ""}` }}
                  htmlFor="dateOfBirth"
                >
                  Birth Date
                </label>
                {errors.dateOfBirth && (
                  <div className="invalid-feedback">{errors.dateOfBirth}</div>
                )}
              </div>

              <div className="col-12 col-md-5 form-floating p-0">
                <FilterableDropdown
                  darkMode={darkMode}
                  items={roles}
                  name={"role"}
                  filterType={"Select Role:"}
                  handleFunction={handleChanges}
                  error={errors.role}
                  selectedValue={user.role}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="card-footer text-center p-4">
            <button
              type="submit"
              className="btn btn-success text-light"
              disabled={isLoading}
              style={{ width: "9.375rem" }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding...
                </>
              ) : (
                "UPDATE"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
