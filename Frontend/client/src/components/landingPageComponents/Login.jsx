import React from "react";
import { Link } from "react-router";
import { loginUser } from "../../APIs/ApisHandaler";
import { useNavigate } from "react-router";

export default function Login({ darkMode }) {

  const navigate = useNavigate();
  
  const login = async (email, password) => {
    try {
      await loginUser(email, password).then((response) => {
        console.log(`The axios response is:`, response.data);
  
        localStorage.setItem("token", response.data.token); 
        console.log("Login successful!");
  
        navigate("/home");
      }).catch((error) => {
        console.error("Login failed:", error);
      });
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the email and password from the form inputs
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      console.error("Both fields are required.");
      return;
    }

    // Call the login function with the email and password
    login(email, password);
  };

  return (
    <div className={`custom-form ${darkMode ? "spic-dark-mode" : ""}`}>
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">Welcome Back!</h1>
      </div>
      <div className="w-50 position-relative my-4">
        {" "}
        <hr className="bold-hr mid-aligment" />
      </div>
      <div className="w-50 my-4 position-relative">
        <form className="mid-aligment" onSubmit={handleSubmit}>
          <div className="form-group my-4">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Email..."
            />
          </div>
          <div className="form-group my-4">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password..."
            />
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between my-4 mid-bold">
            <Link to={"/signup"}>Forgot Your Password?</Link>
            <div>
              Don't have an Account? <Link to={"/signup"}>Sign up</Link>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 high-bold p-2">
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
