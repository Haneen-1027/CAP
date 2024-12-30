import React from "react";
import { Link } from "react-router";

export default function Login() {
  return (
    <div className="custom-form">
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">Welcome Back!</h1>
      </div>
      <div className="w-50 position-relative my-4">
        {" "}
        <hr className="bold-hr mid-aligment" />
      </div>
      <div className="w-50 my-4 position-relative">
        <form className="mid-aligment">
          <div className="form-group my-4">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Email..."
            />
          </div>
          <div className="form-group my-4">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password..."
            />
          </div>
          <div className="d-flex justify-content-between my-4 mid-bold">
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
