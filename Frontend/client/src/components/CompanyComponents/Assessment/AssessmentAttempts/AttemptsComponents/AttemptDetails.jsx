import React from "react";
import { BackBtn } from "../../../../../componentsLoader/ComponentsLoader";
import { Link } from "react-router-dom";

export default function AttemptDetails({ darkMode }) {
  return (
    <>
      <BackBtn />
      <div
        className={`card my-4 d-flex flex-column ${
          darkMode ? " spic-dark-mode" : ""
        }`}
      >
        <div className="card-header p-3 d-flex justify-content-center">
          <h1 className="h5">
            <strong>Details:</strong>
          </h1>
        </div>
        <div className="table-responsive">
          {" "}
          <table
            className={`table ${darkMode ? "table-dark " : "table-light"}`}
          >
            <thead className={darkMode ? "spic-dark-mode" : "table-light"}>
              <tr>
                <th className="" title="Contributor's Username">
                  Username
                </th>
                <th className="" title="Contributor's Full Name">
                  Full Name
                </th>
                <th title="The total attempt time in minutes:">Total Time</th>
                <th
                  title="Assessment Starts from - to"
                  style={{ width: "25%" }}
                >
                  From - to
                </th>
                <th>Questions Count</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              <tr>
                <td>@SomeCont</td>
                <td>Some Contributor</td>
                <td>136 Min</td>
                <td>16:01 - 18:17</td>
                <td>4</td>
              </tr>
            </tbody>
          </table>
          <div className="my-4 d-flex justify-content-center">
            <Link
              to={"/attempts/details/evaluation"}
              className="btn btn-success btn-sm"
            >
              Start Evaluation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
