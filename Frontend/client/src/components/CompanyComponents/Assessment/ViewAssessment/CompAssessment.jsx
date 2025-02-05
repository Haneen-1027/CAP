import React from "react";
import { Link } from "react-router-dom";

export default function CompAssessment({ darkMode }) {

    return (
        <>
            <div className={`card ${darkMode ? " spic-dark-mode" : ""
                }`}>
                <div className={`card-header d-flex justify-content-between align-items-center ${darkMode ? " spic-dark-mode" : ""
                    }`}>
                    <h5 className="text-center mb-0"><strong>Assessment Table</strong></h5>
                    <Link
                        to="/company/assessment/add"
                        type="button"
                        className={`btn btn-light btn-sm d-flex align-items-center ${darkMode ? " spic-dark-mode" : ""
                            }`}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New Assessment
                    </Link>
                </div>
                <div className={`table-responsive text-nowrap ${darkMode ? "spic-dark-mode" : ""}`}>
                    <table className="table">
                        <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
                            <tr>
                                <th>#</th>
                                <th>Project</th>
                                <th>Creator</th>
                                <th>Time</th>
                                <th>Question Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            <tr>
                                <td>1</td>
                                <td><strong>Angular Project</strong></td>
                                <td>Albert Cook</td>
                                <td>90 min</td>
                                <td><span className="bg-label-primary text-primary me-1">15</span></td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Link to={`/company/assessment/${1}`} className="btn btn-sm btn-outline-primary" title="Edit">
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        <button type="button" className="btn btn-sm btn-outline-danger" title="Delete">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}