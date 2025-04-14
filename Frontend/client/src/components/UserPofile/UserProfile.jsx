import React, { useState } from "react";
import "./UserProfile.css";

export default function UserProfile({ userDetailes, darkMode }) {
  const [user, setUser] = useState({ ...userDetailes });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div
      className={`profile-container container mt-5 custom-form ${
        darkMode ? " spic-dark-mode" : ""
      }`}
    >
      <div
        className={`${
          darkMode ? " spic-dark-mode border-white" : ""
        } card shadow-lg p-4 rounded profile-card`}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${darkMode ? " spic-dark-mode" : ""} form-control`}
              />
            ) : (
              <p className={`${darkMode ? "text-light" : ""}  form-text`}>
                {user.firstName}
              </p>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${darkMode ? " spic-dark-mode" : ""} form-control`}
              />
            ) : (
              <p className={`${darkMode ? "text-light" : ""}  form-text`}>
                {user.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${darkMode ? " spic-dark-mode" : ""} form-control`}
            />
          ) : (
            <p className={`${darkMode ? "text-light" : ""}  form-text`}>
              {user.email}
            </p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Bio:</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={`${
                darkMode ? " spic-dark-mode text-light" : ""
              } form-control`}
            />
          ) : (
            <p className={`${darkMode ? "text-light" : ""}  form-text`}>
              {user.bio}
            </p>
          )}
        </div>
        <div className="d-flex justify-content-end">
          {isEditing ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
