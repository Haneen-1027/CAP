import React from "react";

export default function LargeModal({ goal }) {
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
        class="modal fade bd-example-modal-lg"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            Here we wil add an array of emails to send the link of asssessment
            attempt for them ...
          </div>
        </div>
      </div>
    </>
  );
}
