import React from "react";
import { InviteContributors } from "../../componentsLoader/ComponentsLoader";

export default function LargeModal({ goal, darkMode, isUpComing }) {
  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-success"
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
            {isUpComing ? (
              <InviteContributors darkMode={darkMode} />
            ) : (
              "Here we will see the attempts of each assessment."
            )}
          </div>
        </div>
      </div>
    </>
  );
}
