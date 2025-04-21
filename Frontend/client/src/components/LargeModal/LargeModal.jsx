import React from "react";
import { InviteContributors } from "../../componentsLoader/ComponentsLoader";

export default function LargeModal({
  goal,
  darkMode,
  isUpComing,
  assessment_id,
}) {
  const modalId = `modal-${assessment_id}`;

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-success"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <i className={`fas ${goal ? goal : "fa-user-plus"}`}></i>
      </button>

      <div
        className="modal fade"
        id={modalId}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {isUpComing ? (
              <InviteContributors
                assessment_id={assessment_id ? assessment_id : ""}
                darkMode={darkMode}
              />
            ) : (
              "Here we will see the attempts of each assessment."
            )}
          </div>
        </div>
      </div>
    </>
  );
}
