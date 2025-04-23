import React, { useState } from "react";
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
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  /////////////
  // Handle Changes
  function handleChanges(e) {
    setApiError(false);
    setServerMessage("");
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  }
  // Handle Submit
  async function onSubmit() {
    setIsLoading(true);
    const newUser = {
      ...user,
      ["password"]: user.username + "This is a defaul password22!",
    };
    try {
      await addUser(newUser).then((response) => {
        console.log(`The axios response is: ${response}`);
      });
      setUser({
        username: "",
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        password: "",
        dateOfBirth: "",
      });
    } catch (error) {
      console.error(error);
      setApiError(true);
      setServerMessage("There is an Error!");
    } finally {
      setIsLoading(false);
    }
  }
  ////////////
  return (
    <>
      <BackBtn />
      <div className={`card ${darkMode ? " spic-dark-mode" : ""} my-4`}>
        {/** Primary Header ( Title + Additional Link ) */}
        <div
          className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-4 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h1 className="h5 text-center mb-0">
            <strong>Add User:</strong>
          </h1>
        </div>
        {/** First + Last Name */}
        <div
          className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-3 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          {" "}
          <div className="col-12 col-md-5 row m-0 justify-content-between">
            <div className="col-12 col-md-5 form-floating  p-0">
              <input
                type="text"
                className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
                id="firstName"
                name="firstName"
                placeholder="..."
                onChange={(e) => handleChanges(e)}
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="col-12 col-md-5 form-floating my-2 m-md-0 p-0">
              <input
                type="text"
                className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
                id="lastName"
                name="lastName"
                placeholder="..."
                onChange={(e) => handleChanges(e)}
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
          <div className="col-12 col-md-5 form-floating ">
            <input
              type="text"
              className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
              id="username"
              name="username"
              placeholder="..."
              onChange={(e) => handleChanges(e)}
            />
            <label htmlFor="username">Username:</label>
          </div>
        </div>
        {/** Email + Date of Birth + Role */}
        <div
          className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center p-3 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <div className="col-12 col-md-5 form-floating p-0">
            <input
              type="email"
              className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
              id="email"
              name="email"
              placeholder="..."
              onChange={(e) => handleChanges(e)}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="col-12 col-md-5 row m-0 justify-content-between">
            <div className="col-12 col-md-5 form-floating p-0 my-2 m-md-0 p-0">
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                onChange={(e) => handleChanges(e)}
              />
              <label htmlFor="dateOfBirth" style={{ margin: "0 !important" }}>
                Birth Date:
              </label>
            </div>
            <div className="col-12 col-md-5 form-floating p-0">
              <FilterableDropdown
                darkMode={darkMode}
                items={roles}
                name={"role"}
                filterType={"Select Role:"}
                handleFunction={handleChanges}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <button
          onClick={() => onSubmit()}
          className="btn btn-success"
          style={{ width: "9.375rem" }}
        >
          ADD
        </button>
      </div>
    </>
  );
}
