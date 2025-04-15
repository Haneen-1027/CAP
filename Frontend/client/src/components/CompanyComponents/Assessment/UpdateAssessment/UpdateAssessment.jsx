import React, { useState } from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";
import { Link } from "react-router";

export default function UpdateAssessment({ darkMode }) {
  //
  /* const [selectedQuestionsTotalMark, setSelectedQuestionsTotalMark] =
    useState(0);*/

  //
  const assessment = {
    createdBy: "user111",
    name: "First Test Assessment.",
    duration: "01:30",
    time: "2025-04-02",
    start_time: "16:00",
    end_time: "18:00",
    total_mark: 35,
    questions_count: 5,
    questions: [
      {
        question: {
          id: "1",
          type: "mc",
          prompt: "What does HTML stand for?",
          category: "HTML",
          detailes: {
            isTrueFalse: false,
            correctAnswer: "HyperText Markup Language",
            wrongOptions: [
              "Hyper Transfer Markup Language",
              "HighText Machine Language",
              "Hyperlink and Text Markup Language",
            ],
          },
        },
        mark: 5.0,
      },
      {
        question: {
          id: "Id1Explain the importance of CSS in modern web development.",
          type: "essay",
          prompt: "Explain the importance of CSS in modern web development.",
          category: "CSS",
          detailes: {},
        },
        mark: 10.0,
      },
      {
        question: {
          id: "Id2Write a JavaScript function that reverses a string.",
          type: "coding",
          prompt: "Write a JavaScript function that reverses a string.",
          category: "JavaScript",
          detailes: {
            inputsCount: 1,
            testCases: [
              {
                inputs: ["hello"],
                expectedOutput: "olleh",
              },
              {
                inputs: ["world"],
                expectedOutput: "dlrow",
              },
            ],
          },
        },
        mark: 15.0,
      },
    ],
  };
  //Errors variables
  let [apiError, setApiError] = useState(false);
  let apiErrorMessage = (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="alert alert-danger my-4 mid-bold w-100 d-flex justify-content-center">
        Error!!!
      </div>
      <div className="my-4 mid-bold">
        Theres a proplem! Please wait for us to solve the proplem.
      </div>
    </div>
  );
  let loadingMessage = (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
  //////////////////////
  /** Functions */
  //////////////////////
  /** Effects */
  //////////////////////
  return (
    <>
      <BackBtn />
      {apiError ? (
        apiErrorMessage
      ) : (
        <div className={`my-4 card ${darkMode ? "spic-dark-mode" : ""}`}>
          <div className="card-header d-flex align-items-md-center">
            <h5 className="text-center p-2 mb-0">
              <strong>{assessment.name}</strong>
            </h5>
          </div>
          {/** Duration & Time  */}
          <div className="card-header p-4 row m-0 gap-1 d-flex justify-content-between align-items-md-center">
            <div className="form-group  m-lg-0 col-12 col-lg-3 d-flex flex-column">
              <label htmlFor="duration">Duration:</label>
              <input
                type="text"
                placeholder="hh:mm"
                pattern="^([0-9]{1,2}):([0-5][0-9])$"
                className="form-control"
                id="duration"
                name="duration"
                value={assessment.duration}
                disabled
              />
            </div>
            <div className="p-0 form-group col-12 col-lg-8 row m-0  d-flex justify-content-center justify-content-lg-end">
              <div className="my-2 m-md-0 col-12 col-md-4">
                <label htmlFor="time">Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="time"
                  name="time"
                  value={assessment.time}
                  disabled
                />
              </div>
              <div className="mb-2 m-md-0 col-12 col-md-4">
                <label htmlFor="start_time">Start:</label>
                <input
                  type="time"
                  className="form-control"
                  id="start_time"
                  name="start_time"
                  value={assessment.start_time}
                  disabled
                />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="end_time">End:</label>
                <input
                  type="time"
                  className="form-control"
                  id="end_time"
                  name="end_time"
                  value={assessment.end_time}
                  disabled
                />
              </div>
            </div>
          </div>
          {/** Total Mark & Questions Count */}
          <div className="card-header p-4 row m-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="mb-2 m-md-0 form-group col-12 col-md-6 d-flex flex-column ">
              <label htmlFor="total_mark">Total Mark:</label>
              <input
                type="number"
                className="form-control"
                id="total_mark"
                name="total_mark"
                value={assessment.total_mark}
                disabled
              />
            </div>
            <div className="form-group col-12 col-md-6 d-flex flex-column ">
              <label htmlFor="questions_count">Questions Count:</label>
              <input
                type="number"
                className="form-control"
                id="questions_count"
                name="questions_count"
                value={assessment.questions_count}
                disabled
              />
            </div>
          </div>
          {/** Questions List */}
          <div className="table-responsive text-nowrap">
            <table
              className={`table m-0 ${
                darkMode ? "table-dark " : "table-light"
              }`}
            >
              <thead className={``}>
                <tr>
                  <th>#.</th>
                  <th className="text-start">Category</th>
                  <th className="text-start" style={{ width: "20rem" }}>
                    Prompt
                  </th>
                  <th className="text-start">Type</th>
                  <th className="text-start">Mark</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {assessment.questions.map((q, index) => (
                  <tr key={index}>
                    <td>{index < 9 ? "0" + (index + 1) : index + 1}.</td>
                    <td className="text-start">{q.question.category}</td>
                    <td
                      className="text-start text-truncate"
                      style={{
                        maxWidth: "20rem",
                      }}
                    >
                      <strong className="text-truncate">
                        {q.question.prompt}
                      </strong>
                    </td>
                    <td className="text-start">
                      {q.question.type
                        ? q.question.type === "mc"
                          ? q.question.detailes.isTrueFalse === true
                            ? "True/False"
                            : "Multiple Choice"
                          : q.question.type === "essay"
                          ? "Essay"
                          : q.question.type === "coding"
                          ? "Coding"
                          : "Not-valid type"
                        : "There is no Type"}
                    </td>
                    <td className="text-start">{q.mark}</td>
                  </tr>
                ))}
                <tr className="">
                  <td />
                  <td />
                  <td />
                  <td />
                  <td className="text-start">
                    Total Selected:{" "}
                    <strong className="">
                      {assessment.questions.reduce(
                        (total, question) => total + parseFloat(question.mark),
                        0
                      )}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-header p-4 row m-0 ">
            <div className="d-flex justify-content-center align-items-center">
              <Link
                to={`/assessment/update/${1234}`}
                state={{
                  data: {
                    ...assessment,
                    ["questions_ids"]: assessment.questions.map((q, index) => ({
                      id: q.question.id,
                      mark: q.mark,
                    })),
                  },
                }}
                className="btn btn-success"
              >
                Update Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
