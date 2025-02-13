import React, { useEffect, useState } from "react";

export default function AssessmentDetails({
  darkMode,
  assessment,
  isWithinRange,
  setisWithinRange,
  setIsStarted,
}) {
  //
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Convert given variables to Date objects
  const currentDate = currentDateTime.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = currentDateTime.toTimeString().slice(0, 5); // HH:MM

  const startDateTime = new Date(
    `${assessment.time}T${assessment.start_time}:00`
  );
  const endDateTime = new Date(`${assessment.time}T${assessment.end_time}:00`);

  //////////////////
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date(`${currentDate}T${currentTime}:00`);
    console.log("startDateTime: ", startDateTime);
    console.log("endDateTime: ", endDateTime);
    console.log("now: ", now);
    setisWithinRange(now >= startDateTime && now <= endDateTime);
  }, [currentDateTime]); // Runs only when currentDateTime updates
  return (
    <>
      {" "}
      <div className={`card ${darkMode ? "spic-dark-mode border-light" : ""}`}>
        <div
          className={`p-4 card-header d-flex justify-content-md-center align-items-md-center ${
            darkMode ? "border-light" : ""
          }`}
        >
          <strong>{assessment.name}</strong>
        </div>
        <div
          className={`p-4 card-header ${
            darkMode ? "spic-dark-mode border-light" : ""
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
                    {assessment.time}
                  </td>
                  <td
                    className={`${darkMode ? "bg-transparent text-light" : ""}`}
                  >
                    {assessment.start_time}
                  </td>
                  <td
                    className={`${darkMode ? "bg-transparent text-light" : ""}`}
                  >
                    {assessment.end_time}
                  </td>
                  <td
                    className={`${darkMode ? "bg-transparent text-light" : ""}`}
                  >
                    {assessment.duration}
                  </td>
                  <td
                    className={`${darkMode ? "bg-transparent text-light" : ""}`}
                  >
                    {assessment.total_mark}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 d-flex justify-content-center">
              <button
                onClick={() => setIsStarted(true)}
                disabled={!isWithinRange}
                className="btn btn-primary"
              >
                {!isWithinRange ? "Please Wait" : "Start Assessment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
