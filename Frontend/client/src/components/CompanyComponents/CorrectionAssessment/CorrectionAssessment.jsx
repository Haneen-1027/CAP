import React from 'react'

function CorrectionAssessment({ darkMode, selectedAttempt, onGoBack }) {
    return (
        <>
            <div className={`card ${darkMode ? "spic-dark-mode border-light" : ""}`}>
                <div
                    className={`p-4 card-header d-flex justify-content-md-center align-items-md-center ${darkMode ? "border-light" : ""
                        }`}
                >
                    <strong>JavaScript Basics Quiz</strong>
                </div>
                <div
                    className={`p-4 card-header ${darkMode ? "spic-dark-mode border-light" : ""
                        }`}
                >
                    <div className="table-responsive text-nowrap">
                        <table className={`my-1 table ${darkMode ? "" : "table-light"}`}>
                            <thead>
                                <tr>
                                    <th
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        Date
                                    </th>
                                    <th
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        Start at
                                    </th>
                                    <th
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        End at
                                    </th>
                                    <th
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        Duration
                                    </th>
                                    <th
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        Total Mark
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        ok
                                    </td>
                                    <td
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        ok
                                    </td>
                                    <td
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        ok
                                    </td>
                                    <td
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        ok
                                    </td>
                                    <td
                                        className={`${darkMode ? "bg-transparent text-light" : ""}`}
                                    >
                                        ok
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 d-flex justify-content-center">
                            <button className="btn btn-primary m-2">
                                start
                            </button>

                            <button className="btn btn-secondary m-2" onClick={onGoBack}>
                                Back to Attempts
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CorrectionAssessment