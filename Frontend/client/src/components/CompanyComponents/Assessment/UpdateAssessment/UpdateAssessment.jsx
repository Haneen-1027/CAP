import React, { useState, useEffect } from "react";
import { BackBtn, PaginationNav } from "../../../../componentsLoader/ComponentsLoader";
import { useParams } from "react-router-dom";
import {
  getAssessmentById,
  updateAssessment,
  getAllQuestions,
} from "../../../../APIs/ApisHandaler";

export default function UpdateAssessment({ darkMode }) {
  const { id } = useParams();
  const [assessment, setAssessment] = useState({
    name: "",
    duration: "",
    assessmentDate: "",
    startTime: "",
    endTime: "",
    totalMark: 0,
    questionsCount: 0,
    questionsIds: [],
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const countPerPageOptions = [5, 10, 15, 20, 25];

  // Calculate pagination values
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalQuestionsCount = allQuestions.length;

  const handleCountPerPageChange = (e) => {
    setQuestionsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentRes, questionsRes] = await Promise.all([
          getAssessmentById(id),
          getAllQuestions(),
        ]);

        const data = assessmentRes.data;
        const transformed = {
          name: data.name || "",
          duration: data.duration?.slice(0, 5) || "",
          time: data.assessmentDate?.split("T")[0] || "",
          startTime: data.startTime?.slice(0, 5) || "",
          endTime: data.endTime?.slice(0, 5) || "",
          totalMark: data.totalMark || 0,
          questionsCount: data.questionsCount || 0,
          questionsIds:
            data.questions?.map((q) => ({
              id: q.questionId,
              prompt: q.prompt,
              mark: q.mark,
            })) || [],
        };

        setAssessment(transformed);
        setAllQuestions(questionsRes.data);
      } catch {
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getSelectedQuestion = (id) =>
    assessment.questionsIds.find((q) => q.id === id);

  const totalSelectedMark = assessment.questionsIds.reduce(
    (sum, q) => sum + q.mark,
    0
  );

  const toggleQuestion = (question) => {
    const exists = getSelectedQuestion(question.id);
    if (exists) {
      setAssessment((prev) => ({
        ...prev,
        questionsIds: prev.questionsIds.filter((q) => q.id !== question.id),
      }));
      setError("");
    } else {
      if (assessment.questionsIds.length >= assessment.questionsCount) {
        setError(
          `You can select up to ${assessment.questionsCount} questions.`
        );
        return;
      }
      if (totalSelectedMark + 1 > assessment.totalMark) {
        setError(`Total mark limit (${assessment.totalMark}) exceeded.`);
        return;
      }
      setAssessment((prev) => ({
        ...prev,
        questionsIds: [
          ...prev.questionsIds,
          { id: question.id, prompt: question.prompt, mark: 1 },
        ],
      }));
      setError("");
    }
  };

  const updateQuestionMark = (questionId, newMark) => {
    const parsedMark = parseInt(newMark);
    if (isNaN(parsedMark)) return;

    const updated = assessment.questionsIds.map((q) =>
      q.id === questionId ? { ...q, mark: parsedMark } : q
    );

    const newTotal = updated.reduce((sum, q) => sum + q.mark, 0);
    if (newTotal > assessment.totalMark) {
      setError(
        `Total marks exceed the allowed mark of ${assessment.totalMark}.`
      );
      return;
    }

    setAssessment({ ...assessment, questionsIds: updated });
    setError("");
  };

  const handleUpdate = async () => {
    if (
      assessment.questionsIds.length !== assessment.questionsCount ||
      totalSelectedMark !== assessment.totalMark
    ) {
      setError(
        "Selected question count or total marks do not match input limits."
      );
      return;
    }

    if (window.confirm("Are you sure you want to update this assessment?")) {
      try {
        const payload = {
          name: assessment.name,
          duration: `${assessment.duration}:00`,
          time: assessment.time,
          startTime: `${assessment.startTime}:00`,
          endTime: `${assessment.endTime}:00`,
          totalMark: assessment.totalMark,
          questionsCount: assessment.questionsCount,
          questionsIds: assessment.questionsIds,
        };
        await updateAssessment(id, payload);
        alert("Assessment updated successfully!");
      } catch {
        alert("Failed to update assessment.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (apiError) return <div>Error loading assessment</div>;

  const renderQuestionTable = () => (
      <div
        className={`table-responsive text-nowrap mt-5 ${darkMode ? "spic-dark-mode" : ""
          }`}
      >

        <table className={`table ${darkMode ? "table-dark" : "table-light"}`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Prompt</th>
              <th>Category</th>
              <th>Type</th>
              <th>Mark</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((q, i) => {
              const isSelected = !!getSelectedQuestion(q.id);
              const selected = getSelectedQuestion(q.id);
              const markLimitReached =
                totalSelectedMark >= assessment.totalMark && !isSelected;
              const questionLimitReached =
                assessment.questionsIds.length >= assessment.questionsCount &&
                !isSelected;

              return (
                <tr key={q.id}>
                  <td>{indexOfFirstQuestion + i + 1}</td>
                  <td>{q.prompt}</td>
                  <td>{q.category}</td>
                  <td>
                    {q.type === "mc"
                      ? q.details?.isTrueFalse
                        ? "True/False"
                        : "MCQ"
                      : q.type}
                  </td>
                  <td>
                    {isSelected ? (
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "80px" }}
                        min={1}
                        value={selected?.mark || ""}
                        onChange={(e) => updateQuestionMark(q.id, e.target.value)}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestion(q)}
                      disabled={questionLimitReached || markLimitReached}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );

  return (
    <>
      <BackBtn />
      <div className={`my-4 card ${darkMode ? "spic-dark-mode" : ""}`}>
        <div className="card-header">
          <h5 className="text-center mb-0">
            <strong>Update Assessment</strong>
          </h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Name:</label>
              <input
                className="form-control"
                value={assessment.name}
                onChange={(e) =>
                  setAssessment({ ...assessment, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label>Duration:</label>
              <input
                className="form-control"
                value={assessment.duration}
                onChange={(e) =>
                  setAssessment({ ...assessment, duration: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label>Date:</label>
              <input
                className="form-control"
                type="date"
                value={assessment.time || ""}
                onChange={(e) =>
                  setAssessment({ ...assessment, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <label>Start Time:</label>
              <input
                className="form-control"
                type="time"
                value={assessment.startTime || ""}
                onChange={(e) =>
                  setAssessment({ ...assessment, startTime: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label>End Time:</label>
              <input
                className="form-control"
                type="time"
                value={assessment.endTime || ""}
                onChange={(e) =>
                  setAssessment({ ...assessment, endTime: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label>Total Mark:</label>
              <input
                type="number"
                className="form-control"
                value={assessment.totalMark}
                onChange={(e) =>
                  setAssessment({
                    ...assessment,
                    totalMark: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="col-md-2">
              <label>Questions Count:</label>
              <input
                type="number"
                className="form-control"
                value={assessment.questionsCount}
                onChange={(e) =>
                  setAssessment({
                    ...assessment,
                    questionsCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="row mt-3 align-items-center">
        <div className="my-4 m-lg-0 col-12 col-lg-5 d-flex justify-content-center">
          <PaginationNav
            darkMode={darkMode}
            counts={totalQuestionsCount}
            pageNo={currentPage}
            setPageNo={setCurrentPage}
            countPerPage={questionsPerPage}
          />
        </div>

        <div className="count-per-page col-12 col-lg-3 d-flex flex-column flex-lg-row align-items-center gap-2">
          <label className="m-0" style={{ fontSize: "0.95rem" }}>
            Questions per Page:
          </label>
          <select
            className="form-select"
            aria-label="Questions per page"
            value={questionsPerPage}
            onChange={handleCountPerPageChange}
            style={{ width: "80px" }}
          >
            {countPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {renderQuestionTable()}

          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-success" onClick={handleUpdate}>
              Update Assessment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
