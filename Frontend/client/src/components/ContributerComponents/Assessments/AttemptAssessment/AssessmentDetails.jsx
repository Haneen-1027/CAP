import React, { useEffect, useState } from "react";

export default function AssessmentDetails({
  darkMode,
  assessment,
  isWithinRange,
  setIsWithinRange,
  isStarted,
  setIsStarted,
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(null);

  // Convert assessment times to Date objects
  const startDateTime = new Date(`${assessment.time}T${assessment.start_time}:00`);
  const endDateTime = new Date(`${assessment.time}T${assessment.end_time}:00`);

  // Calculate time left until start or time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);

      if (now < startDateTime) {
        // Assessment hasn't started yet
        const diff = startDateTime - now;
        setTimeLeft(formatTimeDifference(diff));
        setIsWithinRange("yet");
      } else if (now >= startDateTime && now <= endDateTime) {
        // Assessment is active
        const diff = endDateTime - now;
        setTimeLeft(formatTimeDifference(diff));
        setIsWithinRange("now");
      } else {
        // Assessment has ended
        setTimeLeft("00:00:00");
        setIsWithinRange("done");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assessment.time, assessment.start_time, assessment.end_time]);

  // Format time difference as HH:MM:SS
  const formatTimeDifference = (diff) => {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Format duration for display (from "01:00:00" to "1 hour")
  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(':');
    if (hours === '00') return `${minutes} minutes`;
    if (minutes === '00') return `${parseInt(hours)} hour${hours !== '01' ? 's' : ''}`;
    return `${parseInt(hours)} hour${hours !== '01' ? 's' : ''} ${parseInt(minutes)} minutes`;
  };

  return (
    <div className={`card ${darkMode ? "spic-dark-mode border-light" : ""}`}>
      <div className={`p-4 card-header ${darkMode ? "border-light" : ""}`}>
        <h4 className="mb-0 text-center">
          <strong>{assessment.name}</strong>
        </h4>
      </div>

      <div className={`p-4 card-header ${darkMode ? "spic-dark-mode border-light" : ""}`}>
        <div className="table-responsive">
          <table className={`table ${darkMode ? "table-dark" : "table-light"}`}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Total Marks</th>
                <th>Questions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date(assessment.time).toLocaleDateString()}</td>
                <td>{assessment.start_time}</td>
                <td>{assessment.end_time}</td>
                <td>{formatDuration(assessment.duration)}</td>
                <td>{assessment.total_mark}</td>
                <td>{assessment.questions_count}</td>
                <td>
                  <span className={`badge ${isWithinRange === "yet" ? "bg-secondary" :
                      isWithinRange === "now" ? "bg-success" :
                        "bg-danger"
                    }`}>
                    {isWithinRange === "yet" ? "Not Started" :
                      isWithinRange === "now" ? "Available" :
                        "Closed"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          {isWithinRange === "yet" && (
            <div className="alert alert-info text-center">
              Assessment will start in: {timeLeft}
            </div>
          )}
          {isWithinRange === "now" && (
            <div className="alert alert-success text-center">
              Time remaining: {timeLeft}
            </div>
          )}
          {isWithinRange === "done" && (
            <div className="alert alert-danger text-center">
              This assessment has ended
            </div>
          )}
        </div>

        <div className="mt-4 d-flex justify-content-center">
          <button
            onClick={() => setIsStarted(true)}
            disabled={isWithinRange !== "now"}
            className={`btn btn-lg ${isWithinRange === "now" ? "btn-success" :
                isWithinRange === "yet" ? "btn-secondary" : "btn-danger"
              }`}
          >
            {isWithinRange === "yet" ? "Assessment Not Started Yet" :
              isWithinRange === "now" ? "Start Assessment Now" :
                "Assessment Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}