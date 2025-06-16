import React, { useState } from "react";
import { signUp } from "../../APIs/ApisHandaler";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function Signup({ darkMode }) {
  const navigate = useNavigate();
  const [userDetails, setNewUserDetails] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [apiLoading, setApiLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setNewUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      setApiLoading(true);
      let res = signUp(userDetails);
      console.log("sign Up: ", res);
      setNewUserDetails({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      navigate("/login", {
        state: {
          justSignUp: true,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <div className={`custom-form ${darkMode ? " spic-dark-mode" : ""}`}>
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">Create Your Account</h1>
      </div>
      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>
      <div className="w-50 position-relative my-4">
        <form className="mid-aligment" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group my-4">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username..."
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              placeholder="First Name..."
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              placeholder="Last Name..."
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="email"
              className="form-control"
              id="email1"
              name="email"
              placeholder="Email..."
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group my-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password..."
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 high-bold p-2"
            disabled={apiLoading}
          >
            {apiLoading ? "Creating ..." : "Create Account"}
          </button>
        </form>
      </div>

      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>
    </div>
  );
}
