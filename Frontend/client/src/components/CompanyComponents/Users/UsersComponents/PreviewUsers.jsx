import { Link } from "react-router";

export default function PreviewUsers({ darkMode }) {
  return (
    <>
      <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
        <div
          className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
            darkMode ? " spic-dark-mode" : ""
          }`}
        >
          <h5 className="text-center mb-0">
            <strong>Assigned Users</strong>
          </h5>
          <Link
            to="/company/users/addNewUser"
            type="button"
            className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            <i className="fas fa-plus me-2"></i>
            Add New User
          </Link>
        </div>
        <div className="card-header p-4">
          Heres the Search and Filteration system
        </div>
        <div className="card-header">Heres the view table</div>
      </div>
    </>
  );
}
