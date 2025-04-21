import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";

export default function InviteContributors({ darkMode, user }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assessment_id = queryParams.get("id");
  const [invite, setInvite] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [invitesByAssessment, setInvitesByAssessment] = useState({});
  const [validationMessage, setValidationMessage] = useState("");
  ////
  useEffect(() => {
    console.log("Assessment_ID: ", assessment_id);
  }, []);
  useEffect(() => {
    console.log("Invites by assessment: ", invitesByAssessment);
  }, [invitesByAssessment]);

  ////
  if (!user || !user.role) {
    // Not logged in (optional check)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "Company") {
    return <Navigate to="/AuthorizeError" replace />;
  }

  // Add New Invitation
  function addNewInvite(e) {
    e.preventDefault();

    const currentList = invitesByAssessment[assessment_id] || [];

    const isEmailExists = currentList.some((i) => i.email === invite.email);

    if (isEmailExists) {
      setValidationMessage("This email is already in the list!");
    } else {
      const updatedList = [...currentList, invite];
      setInvitesByAssessment((prev) => ({
        ...prev,
        [assessment_id]: updatedList,
      }));
      setInvite({ first_name: "", last_name: "", email: "" });
      setValidationMessage("");
    }
  }

  // Remove a record from the current assessment's list
  function removeRecord(emailToRemove) {
    const currentList = invitesByAssessment[assessment_id] || [];
    const updatedList = currentList.filter((i) => i.email !== emailToRemove);

    setInvitesByAssessment((prev) => ({
      ...prev,
      [assessment_id]: updatedList,
    }));
  }

  // Render invites for current assessment
  function renderInvites() {
    const currentList = invitesByAssessment[assessment_id] || [];
    return currentList.map((inv, index) => (
      <tr key={index}>
        <td>{index < 9 ? "0" + (index + 1) : index + 1}</td>
        <td>{inv.first_name + " " + inv.last_name}</td>
        <td>{inv.email}</td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeRecord(inv.email)}
          >
            X
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        {/* Modal Title */}
        <div
          className={`card-header text-start p-3 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h1 className="h5">
            <strong>Invite Contributors:</strong>
          </h1>
        </div>

        {/* Invite an email */}
        <div
          className={`card-header p-3 row m-0 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <form className="form-floating col-12">
            <input
              type="text"
              className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
              placeholder="First Name"
              value={invite.first_name}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  first_name: e.target.value,
                }))
              }
            />
            <label className={` mx-4 ${darkMode ? "bg-transparent" : ""}`}>
              First Name:
            </label>
          </form>

          <form className="form-floating col-12 my-2">
            <input
              type="text"
              className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
              placeholder="Last Name"
              value={invite.last_name}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  last_name: e.target.value,
                }))
              }
            />
            <label className={` mx-4 ${darkMode ? "bg-transparent" : ""}`}>
              Last Name:
            </label>
          </form>

          <form className="form-floating col-12 mb-2">
            <input
              type="email"
              className={`form-control ${darkMode ? "spic-dark-mode" : ""}`}
              placeholder="name@example.com"
              value={invite.email}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  email: e.target.value,
                }))
              }
            />
            <label className={` mx-4 ${darkMode ? "bg-transparent" : ""}`}>
              Add Email - "name@example.com"
            </label>
          </form>

          {validationMessage && (
            <div className="text-danger text-center">{validationMessage}</div>
          )}

          <div className="col-12 my-2 m-md-0 d-flex justify-content-center">
            <button
              className="btn btn-success"
              style={{ width: "10rem" }}
              onClick={addNewInvite}
            >
              Add
            </button>
          </div>
        </div>

        {/* Handle emails */}
        <div
          className={`table-responsive text-nowrap ${
            darkMode ? "spic-dark-mode" : ""
          }`}
        >
          <table className="table">
            <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
              <tr>
                <th>#</th>
                <th>Name:</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">{renderInvites()}</tbody>
          </table>

          <div className="my-4 d-flex justify-content-center">
            <button
              className="btn btn-success"
              style={{ width: "10rem" }}
              onClick={() => {
                // handle sending invites logic here
                setInvitesByAssessment((prev) => ({
                  ...prev,
                  [assessment_id]: [],
                }));
              }}
            >
              Send Invites
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
