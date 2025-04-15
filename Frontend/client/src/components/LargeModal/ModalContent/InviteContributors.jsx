import { useEffect, useState } from "react";

export default function InviteContributors({ darkMode }) {
  const [invite, setInvite] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [invites, setInvites] = useState([]);

  const [validationMessage, setValidationMessage] = useState("");

  // Add New Invitation
  function addNewInvite(e) {
    const isEmailExists = invites.some((i) =>
      Object.values(i).includes(invite.email)
    );
    if (isEmailExists) {
      setValidationMessage("This email is already in the list!");
    } else {
      setInvites((prevInvites) => [...prevInvites, invite]);
      setInvite({
        first_name: "",
        last_name: "",
        email: "",
      });
    }
  }

  // Remove a record from the array based on (email)
  function removeRecord(inv) {
    const updatedList = invites.filter((invite) => invite.email !== inv.email);
    setInvites(updatedList);
  }

  // Render Invites in the table
  function renderInvites() {
    return invites.map((inv, index) => (
      <tr key={index} className="">
        <td>{index < 10 ? "0" + (index + 1) : index + 1}</td>
        <td>{inv.first_name + " " + inv.last_name}</td>
        <td>{inv.email}</td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeRecord(inv)}
          >
            X
          </button>
        </td>
      </tr>
    ));
  }
  ///////////

  useEffect(() => {
    console.log("Invites List: ", invites);
  }, [invites]);
  useEffect(() => {
    console.log("new invite: ", invite);
  }, [invite]);
  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        {/** Modal Title */}
        <div
          className={`card-header text-start p-3 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h1 className="h5">
            <strong>Invite Contributors:</strong>
          </h1>
        </div>
        {/** Invite an email */}
        <div
          className={`card-header p-3 row m-0 ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <form className="form-floating col-12">
            <input
              type="text"
              className="form-control"
              id="floatingInputValue"
              name="first_name"
              placeholder="First Name"
              value={invite.first_name}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  first_name: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingInputValue" className="mx-4">
              First Name:
            </label>
          </form>
          <form className="form-floating col-12 my-2">
            <input
              type="text"
              className="form-control"
              id="floatingInputValue"
              name="last_name"
              placeholder="Last Name"
              value={invite.last_name}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  last_name: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingInputValue" className="mx-4">
              Last Name:
            </label>
          </form>
          <form className="form-floating col-12 mb-2">
            <input
              type="email"
              className="form-control"
              id="floatingInputValue"
              name="email"
              placeholder="name@example.com"
              value={invite.email}
              onChange={(e) =>
                setInvite((prevInvite) => ({
                  ...prevInvite,
                  email: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingInputValue" className="mx-4">
              Add Email - "name@example.com"
            </label>
          </form>
          <div className="col-12 my-2 m-md-0 d-flex justify-content-center">
            <button
              className="btn btn-success"
              style={{ width: "10rem" }}
              onClick={(e) => addNewInvite(e)}
            >
              Add
            </button>
          </div>
        </div>
        {/** Handle emails */}
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
          <div className="my-4">
            <button className="btn btn-success" style={{ width: "10rem" }}>
              Send Invites
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
