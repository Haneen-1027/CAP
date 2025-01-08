import React from "react";

export default function PaginationNav({
  darkMode,
  counts,
  pageNo,
  setPageNo,
  countPerPage,
}) {
  const totalPages = Math.ceil(counts / countPerPage);

  function displayPaginationItems() {
    const result = [];

    // Always show the first page
    result.push(
      <li
        className={`page-item ${pageNo === 1 ? "active" : ""}`}
        onClick={() => setPageNo(1)}
        key={1}
      >
        <a style={{ cursor: "pointer" }} className="page-link">
          1
        </a>
      </li>
    );

    // Display ellipsis if not starting from the first page
    if (pageNo > 3) {
      result.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Display pages between first and last, or all pages if less than 5
    const startPage = Math.max(2, pageNo - 1);
    const endPage = Math.min(totalPages - 1, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      result.push(
        <li
          className={`page-item ${pageNo === i ? "active" : ""}`}
          onClick={() => setPageNo(i)}
          key={i}
        >
          <a style={{ cursor: "pointer" }} className="page-link">
            {i}
          </a>
        </li>
      );
    }

    // Display ellipsis if not ending at the last page
    if (totalPages - pageNo > 2) {
      result.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Always show the last page
    if (totalPages > 1) {
      result.push(
        <li
          className={`page-item ${pageNo === totalPages ? "active" : ""} ${
            darkMode ? "spic-dark-mode" : ""
          }`}
          onClick={() => setPageNo(totalPages)}
          key={totalPages}
        >
          <a style={{ cursor: "pointer" }} className="page-link">
            {totalPages}
          </a>
        </li>
      );
    }

    return result;
  }

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className={`pagination m-0`}>
          <li
            className={`page-item ${pageNo === 1 ? "disabled" : ""} ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <a
              style={{ cursor: "pointer" }}
              className="page-link"
              onClick={() => setPageNo((prevNo) => Math.max(1, prevNo - 1))}
            >
              Previous
            </a>
          </li>
          {displayPaginationItems()}
          <li
            className={`page-item ${pageNo === totalPages ? "disabled" : ""} ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <a
              style={{ cursor: "pointer" }}
              className="page-link"
              onClick={() =>
                setPageNo((prevNo) => Math.min(totalPages, prevNo + 1))
              }
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
