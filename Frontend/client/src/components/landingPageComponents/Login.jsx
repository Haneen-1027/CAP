import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Joi from "joi";
import { loginUser } from "../../APIs/ApisHandaler";
import { useLocation } from "react-router-dom";

export default function Login({
  darkMode,
  setUserData,
  goToPage,
  userDetails,
  setActiveId,
}) {
  let [user, setUser] = useState({
    email: "",
    password: "",
  });
  let [errorList, setErrorList] = useState([]);
  let [apiError, setApiError] = useState(null); // Changed to store error message
  const [apiLoading, setApiLoading] = useState(false);
  const location = useLocation();
  const { justSignUp } = location.state || false;

  /* Submite Function */
  async function onFormSubmit(e) {
    e.preventDefault();
    setApiLoading(true);
    // Reset errors
    setErrorList([]);
    setApiError(null);

    // Call Validation Function
    let validateResult = validateForm();
    if (validateResult.error) {
      setErrorList(validateResult.error.details);
      return; // Don't proceed with API call if validation fails
    }

    try {
      console.log("user", user);
      const response = await loginUser(user.email, user.password);
      console.log("Response From Login: ", response);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("details", JSON.stringify(response.data.user));
        console.log("Done!");
        setUserData();
        setApiLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Handle different error scenarios
        if (error.response.status === 400 || error.response.status === 401) {
          setApiError("Invalid email or password");
        } else if (error.response.status === 404) {
          setApiError("User not found");
        } else if (error.response.status >= 500) {
          setApiError("Server error. Please try again later.");
        } else {
          setApiError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setApiError("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setApiError("An unexpected error occurred.");
      }
    }
  }

  /* Get New Data Function */
  function getData(e) {
    setErrorList([]);
    if (apiError) setApiError(null);
    if (apiLoading) setApiLoading(false);

    let newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  }

  useEffect(() => {
    if (Object.keys(userDetails).length > 0) {
      goToPage();
    }
  }, [userDetails]);

  /* Validation Function */
  function validateForm() {
    const schema = Joi.object({
      email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } }) // Validate email format
        .required()
        .messages({
          "string.email": "Please enter a valid email address",
          "string.empty": "Email is required",
        }),
      password: Joi.string().trim().min(8).required().messages({
        "string.min": "Password must be at least 8 characters",
        "string.empty": "Password is required",
      }),
    });

    return schema.validate(user, { abortEarly: false });
  }

  useEffect(() => {
    setActiveId(7);
  }, []);

  return (
    <div className={`custom-form ${darkMode ? "spic-dark-mode" : ""}`}>
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">
          {justSignUp ? "Welcome in Our Family!" : "Welcome Back!"}
        </h1>
      </div>
      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>

      {/* Display API errors */}
      {apiError && (
        <div className="col-12">
          <div className="alert alert-danger">{apiError}</div>
        </div>
      )}

      {/* Display validation errors */}
      {errorList.map((error, index) => (
        <div className="col-12" key={index}>
          <div className="alert alert-danger">
            {error.message.replace(/"/g, "")}{" "}
            {/* Remove quotes from messages */}
          </div>
        </div>
      ))}

      <div className="w-50 my-4 position-relative">
        <form className="mid-aligment" onSubmit={onFormSubmit}>
          <div className="form-group my-4">
            <input
              type="email"
              className={`form-control ${
                errorList.some((e) => e.context.key === "email")
                  ? "is-invalid"
                  : ""
              }`}
              id="email"
              name="email"
              placeholder="Email..."
              onChange={getData}
              value={user.email}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="password"
              className={`form-control ${
                errorList.some((e) => e.context.key === "password")
                  ? "is-invalid"
                  : ""
              }`}
              id="password"
              name="password"
              placeholder="Password..."
              onChange={getData}
              value={user.password}
            />
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between my-4 mid-bold">
            <Link to={"/signup"}>Forgot Your Password?</Link>
            <div>
              Don't have an Account? <Link to={"/signup"}>Sign up</Link>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 high-bold p-2"
            disabled={apiLoading}
          >
            {apiLoading ? "Loading ..." : "LogIn"}
          </button>
        </form>
      </div>
      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>
    </div>
  );
}
