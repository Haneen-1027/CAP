import React from "react";

export default function LargeModal({ goal, darkMode }) {
  return (
    <>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        data-bs-toggle="modal"
        data-bs-target=".bd-example-modal-lg"
      >
        <i className={`fas ${goal ? goal : "fa-user-plus"}`}></i>
      </button>

      <div
        className="modal fade bd-example-modal-lg"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
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
                <form className="form-floating col-12 col-md-11">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInputValue"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInputValue" className="mx-4">
                    Add Email - "name@example.com"
                  </label>
                </form>
                <div className="col-12 col-md-1 my-2 m-md-0 d-flex justify-content-center">
                  <button className="btn btn-primary">Add</button>
                </div>
              </div>
              {/** Handle emails */}
              <div
                className={`table-responsive text-nowrap ${
                  darkMode ? "spic-dark-mode" : ""
                }`}
              >
                <table className="table">
                  <thead
                    className={darkMode ? "spic-dark-mode" : "table-light"}
                  >
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    <tr className="">
                      <td>01</td>
                      <td>test@example.com</td>
                      <td>
                        <button className="btn btn-danger btn-sm">X</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
