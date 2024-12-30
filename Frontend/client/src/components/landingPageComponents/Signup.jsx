import React from "react";

export default function Signup() {
  return (
    <div className="custom-form">
      <div className="my-4 w-100 d-flex justify-content-center">
        <h1 className="custom-form-header">Create Your Account</h1>
      </div>
      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>
      <div className="w-50 position-relative my-4">
        <form className="mid-aligment">
          <div className="form-group my-4">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Name..."
            />
          </div>
          <div className="form-group my-4">
            <input
              type="email"
              className="form-control"
              id="email1"
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
          <div className="w-100 position-relative my-4">
            <hr className="bold-hr" />
          </div>
          <button type="submit" className="btn btn-primary w-100 high-bold p-2">
            Create Account
          </button>
        </form>
      </div>

      <div className="w-50 position-relative my-4">
        <hr className="bold-hr mid-aligment" />
      </div>
    </div>
  );
}
