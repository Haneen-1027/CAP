import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Joi from "joi";
import { loginUser } from "../../APIs/ApisHandaler";

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
  let [apiError, setApiError] = useState(false);
  let [notFoundMessage, setNotFoundMessage] = useState(false);

  /* Submite Function */
  async function onFormSubmit(e) {
    e.preventDefault();
    // Call Validation Function
    let validateResult = validateForm();
    if (validateResult.error) {
      setErrorList(validateResult.error.details);
    }

    try {
      console.log("user", user);
      await loginUser(user.email, user.password)
        .then((response) => {
          // Handle the response data
          console.log("Resssponse: ", response);
          setApiError(false);
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            console.log("Done!");
            setUserData();
          }
        })
        .catch((error) => {
          // Handle errors
          if (error.response) {
            setApiError(true);
            if (
              error.response.status === 400 &&
              error.response.data.message === "invaild email or Password"
            ) {
              setNotFoundMessage(true);
            }
          }
          console.error("Axios error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  /* Get New Data Function */
  function getData(e) {
    setErrorList([]);
    setNotFoundMessage(false);
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
      email: Joi.string().trim().min(2).max(15).required(),
      password: Joi.string().trim().min(8).required(),
    });

    return schema.validate(user, { abortEarly: false });
  }
  /////////////////
  useEffect(() => {
    setActiveId(7);
  }, []);

  return (
    <div className={`custom-form ${darkMode ? "spic-dark-mode" : ""}`}>
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">Welcome Back!</h1>
      </div>
      <div className="w-50 position-relative my-4">
        {" "}
        <hr className="bold-hr mid-aligment" />
      </div>
      {notFoundMessage ? (
        <div className="col-12">
          <div className="alert alert-danger">"invaild email or Password"</div>
        </div>
      ) : (
        ""
      )}
      {errorList.map((error, index) => (
        <div className="col-12">
          <div key={index} className="alert alert-danger">
            {" "}
            {error.message}{" "}
          </div>
        </div>
      ))}
      <div className="w-50 my-4 position-relative">
        <form className="mid-aligment" onSubmit={onFormSubmit}>
          <div className="form-group my-4">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Email..."
              onChange={(e) => getData(e)}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password..."
              onChange={(e) => getData(e)}
            />
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between my-4 mid-bold">
            <Link to={"/signup"}>Forgot Your Password?</Link>
            <div>
              Don't have an Account? <Link to={"/signup"}>Sign up</Link>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 high-bold p-2">
            LogIn
          </button>
        </form>
      </div>
      <div className="w-50 position-relative my-4">
        {" "}
        <hr className="bold-hr mid-aligment" />
      </div>
    </div>
  );
}