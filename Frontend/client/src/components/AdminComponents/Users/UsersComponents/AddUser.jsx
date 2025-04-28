import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  BackBtn,
  FilterableDropdown,
} from "../../../../componentsLoader/ComponentsLoader";
import { addUser } from "../../../../APIs/ApisHandaler";

export default function AddUser({ darkMode }) {
  const roles = [
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!user.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (user.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
      isValid = false;
    }

    if (!user.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!user.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!user.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    if (!user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!user.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/.test(user.password)) {
      newErrors.password =
        "Password must contain uppercase, number, and special character";
      isValid = false;
    }

    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!user.dateOfBirth) {
      newErrors.dateOfBirth = "Birth date is required";
      isValid = false;
    } else {
      const dob = new Date(user.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        newErrors.dateOfBirth = "Birth date must be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      await Swal.fire({
        title: "Validation Error",
        text: "Please fix all the errors in the form before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to add a new user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add user!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      await Swal.fire({
        title: "Cancelled",
        text: "User creation was cancelled.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = user;
      await addUser(userData);

      await Swal.fire({
        title: "Success!",
        text: "User has been added successfully.",
        icon: "success",
        confirmButtonText: "Great!",
      });

      // Reset form
      setUser({
        username: "",
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to add user. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  value={user.dateOfBirth}
                  onChange={handleChanges}
                />
                <label htmlFor="dateOfBirth">Birth Date</label>
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
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-3 ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <div className="col-12 col-md-5 form-floating p-0 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                } ${darkMode ? "spic-dark-mode" : ""}`}
                id="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChanges}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="btn btn-sm position-absolute end-0 top-0 mt-2 me-2 bg-transparent border-0"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="col-12 col-md-5 form-floating p-0 my-2 m-md-0">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                } ${darkMode ? "spic-dark-mode" : ""}`}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={user.confirmPassword}
                onChange={handleChanges}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="card-footer text-center p-4">
            <button
              type="submit"
              className="btn btn-success"
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
                "ADD USER"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
