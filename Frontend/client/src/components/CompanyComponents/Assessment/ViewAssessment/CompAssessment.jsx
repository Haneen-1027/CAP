import React from "react";
import { useNavigate } from "react-router-dom";

export default function CompAssessment() {
    const navigate = useNavigate();

    const handleAddAssessment = () => {
        navigate("/add-assessment");
    };

    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="text-center mb-0"><strong>Assessment Table</strong></h5>
                    <button
                        type="button"
                        className="btn btn-light btn-sm d-flex align-items-center"
                        onClick={handleAddAssessment}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New Assessment
                    </button>
                </div>
                <div className="table-responsive text-nowrap">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Project</th>
                                <th>Client</th>
                                <th>Users</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            <tr>
                                <td>1</td>
                                <td><strong>Angular Project</strong></td>
                                <td>Albert Cook</td>
                                <td>Albert Cook</td>
                                <td><span className="bg-label-primary text-primary me-1">Active</span></td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                        >
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