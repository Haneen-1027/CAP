import React from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";

export default function PlayerProfile({ darkMode }) {
  return (
    <>
      <BackBtn />
      <section style={{ backgroundColor: "#eee" }} className="my-2">
        <div className="mx-3 py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: 150 }}
                  />
                  <h5 className="my-3">Full Name</h5>
                  <p className="text-muted mb-1">Squad</p>
                  <p className="text-muted mb-4">Position, #No</p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      {" "}
                      <p className="mb-0">National ID</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">97405646</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">Johnatan Smith</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Birth Date</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">2000/08/24</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Age</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">23</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-12 d-flex justify-content-center mb-2">
                      <p className="text-muted mid-bold mb-0">
                        Physical Attributes
                      </p>
                    </div>
                    <div className="col-12">
                      <div className="table-responsive text-nowrap">
                        <table
                          className={`table  ${
                            darkMode ? "table-dark " : "table-light"
                          }`}
                        >
                          <thead>
                            <tr>
                              <th
                                title="Last Evaluation Date"
                                className="text-muted bg-transparent font-weight-normal user-select-none"
                                style={{ fontSize: "1rem" }}
                              >
                                Date
                              </th>
                              <th
                                title="Height"
                                className="text-muted bg-transparent font-weight-normal user-select-none"
                              >
                                Ht
                              </th>
                              <th
                                title="Weight"
                                className="text-muted bg-transparent font-weight-normal user-select-none"
                              >
                                Wt
                              </th>
                              <th
                                title="Hand Reach"
                                className="text-muted bg-transparent font-weight-normal user-select-none"
                              >
                                HR
                              </th>
                              <th
                                title="Leg Reach"
                                className="text-muted bg-transparent font-weight-normal user-select-none"
                              >
                                LR
                              </th>
                              <th className="text-muted bg-transparent font-weight-normal user-select-none">
                                Jump
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <td>2025-04-02</td>
                            <td>180 cm</td>
                            <td>77 kg</td>
                            <td>77 cm</td>
                            <td>66 cm</td>
                            <td>
                              <span
                                className="bg-transparent user-select-none"
                                title="Standing Jump"
                                style={{ fontSize: "0.85rem" }}
                              >
                                SJ:
                              </span>
                              60 cm
                              <span
                                className="bg-transparent user-select-none"
                                title="Running Standing Jump"
                                style={{ fontSize: "0.85rem" }}
                              >
                                RSJ:
                              </span>
                              45 cm
                            </td>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0">
                    <div className="card-body">
                      <div className="row">
                        <p className="col-6">
                          <span className="text-primary font-italic me-1">
                            Training
                          </span>{" "}
                          Status
                        </p>
                        <div className="col-6 text-end">
                          <p className>
                            <span className="text-primary">{15} </span>Session
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-evenly mb-1">
                        <p className="">
                          <span className="text-primary font-italic">
                            Goals:
                          </span>{" "}
                          67
                        </p>
                        <div className="text-end">
                          <p className>
                            <span className="text-primary">Assists: </span>
                            55
                          </p>
                        </div>
                      </div>
                      <p className="mb-1" style={{ fontSize: ".77rem" }}>
                        Shots - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "80%" }}
                          aria-valuenow={80}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Passes - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "72%" }}
                          aria-valuenow={72}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Blocks - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "89%" }}
                          aria-valuenow={89}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Turnovers - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={55}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Fint - total: {87}
                      </p>
                      <div
                        className="progress rounded mb-2"
                        style={{ height: 5 }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "66%" }}
                          aria-valuenow={66}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0">
                    <div className="card-body">
                      <div className="row">
                        <p className="col-6">
                          <span className="text-primary font-italic me-1">
                            Matches
                          </span>{" "}
                          Status
                        </p>
                        <div className="col-6 text-end">
                          <p className>
                            <span className="text-primary">{15} </span>Match
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-evenly mb-1">
                        <p className="">
                          <span className="text-primary font-italic">
                            Goals:
                          </span>{" "}
                          67
                        </p>
                        <div className="text-end">
                          <p className>
                            <span className="text-primary">Assists: </span>
                            55
                          </p>
                        </div>
                      </div>
                      <p className="mb-1" style={{ fontSize: ".77rem" }}>
                        Shots - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "80%" }}
                          aria-valuenow={80}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Passes - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "72%" }}
                          aria-valuenow={72}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Blocks - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "89%" }}
                          aria-valuenow={89}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Turnovers - total: {87}
                      </p>
                      <div className="progress rounded" style={{ height: 5 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "55%" }}
                          aria-valuenow={55}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                        Fint - total: {87}
                      </p>
                      <div
                        className="progress rounded mb-2"
                        style={{ height: 5 }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "66%" }}
                          aria-valuenow={66}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
