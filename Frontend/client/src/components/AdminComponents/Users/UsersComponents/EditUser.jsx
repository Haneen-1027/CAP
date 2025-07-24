import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByID, updateUser } from "../../../../APIs/ApisHandaler";
import {
  BackBtn,
  FilterableDropdown,
} from "../../../../componentsLoader/ComponentsLoader";
import Swal from "sweetalert2";

export default function EditUser({ darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const roles = [
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    role: ""
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.firstName.trim()) newErrors.firstName = "First name is required";
    if (!user.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!user.username.trim()) newErrors.username = "Username is required";
    
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!user.dateOfBirth) newErrors.dateOfBirth = "Birth date is required";
    if (!user.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(false);

    try {
      const result = await Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        setIsLoading(false);
        return;
      }

      const response = await updateUser(id, user);
      
      await Swal.fire({
        title: 'Success!',
        text: 'User updated successfully',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
            
    } catch (error) {
      setApiError(true);
      let errorMessage = 'Failed to update user';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      setApiError(false);
      
      try {
        const response = await getUserByID(id);
        const userData = response.data;
        
        // Format date for date input (YYYY-MM-DD)
        if (userData.dateOfBirth) {
          userData.dateOfBirth = userData.dateOfBirth.split('T')[0];
        }
        
        setUser(userData);
      } catch (error) {
        setApiError(true);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
        navigate('/admin/users/preview'); // Redirect if user can't be loaded
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Error loading user data. Please try again later.
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/users')}
        >
          Back to Users List
        </button>
      </div>
    );
  }

  return (
    <>
      <BackBtn />
      <div className="container my-4">
        <form onSubmit={onSubmit}>
          <div className={`card ${darkMode ? "spic-dark-mode" : ""}`}>
            <div className={`card-header p-4 ${darkMode ? "spic-dark-mode" : ""}`}>
              <h1 className="h5 text-center mb-0">
                <strong>Edit User</strong>
              </h1>
            </div>

            {/* Name Section */}
            <div className={`card-body p-4 ${darkMode ? "spic-dark-mode" : ""}`}>
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? "is-invalid" : ""} ${
                        darkMode ? "spic-dark-mode" : ""
                      }`}
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={user.firstName || ""}
                      onChange={handleChanges}
                    />
                    <label htmlFor="firstName">First Name</label>
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? "is-invalid" : ""} ${
                        darkMode ? "spic-dark-mode" : ""
                      }`}
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={user.lastName || ""}
                      onChange={handleChanges}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.username ? "is-invalid" : ""} ${
                        darkMode ? "spic-dark-mode" : ""
                      }`}
                      id="username"
                      name="username"
                      placeholder="Username"
                      value={user.username || ""}
                      onChange={handleChanges}
                    />
                    <label htmlFor="username">Username</label>
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email, DOB, Role Section */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="form-floating">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""} ${
                        darkMode ? "spic-dark-mode" : ""
                      }`}
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={user.email || ""}
                      onChange={handleChanges}
                    />
                    <label htmlFor="email">Email</label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="date"
                      className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""} ${
                        darkMode ? "spic-dark-mode text-light" : ""
                      }`}
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={user.dateOfBirth || ""}
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
                </div>
              </div>

              {/* Role */}
              <div className="row">
                <div className="col-12">
                  <FilterableDropdown
                    darkMode={darkMode}
                    items={roles}
                    name={"role"}
                    filterType={"Select Role:"}
                    handleFunction={handleChanges}
                    error={errors.role}
                    selectedValue={user.role}
                  />
                  {errors.role && (
                    <div className="text-danger small mt-1">{errors.role}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="card-footer text-center p-4">
              <button
                type="submit"
                className="btn btn-success text-light"
                disabled={isLoading}
                style={{ width: "150px" }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  "UPDATE USER"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}