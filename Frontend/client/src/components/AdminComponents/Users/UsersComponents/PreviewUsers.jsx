import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { getUsers } from "../../../../APIs/ApisHandaler";
import {
  FilterableDropdown,
  SearchBar,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";

export default function PreviewUsers({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState(-999);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);

  const apiErrorMessage = (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="alert alert-danger my-4 mid-bold w-100 d-flex justify-content-center">
        Error!!!
      </div>
      <div className="my-4 mid-bold">
        There's a problem! Please wait for us to solve the problem.
      </div>
    </div>
  );

  const loadingMessage = (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  const roles = [
    { name: "All", value: -999 },
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];

  const countPerPageValues = [10, 15, 25, 50, 75, 100];

  const handleCountPerPageMenu = (e) => {
    setCountPerPage(Number(e.target.value));
  };

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (err) {
        console.error("Fetching users failed", err);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Apply Search -> Filter -> Sort
  const finalUsers = useMemo(() => {
    let filteredUsers = [...users];

    // Search
    if (searchValue.trim() !== "") {
      filteredUsers = filteredUsers.filter(
        (user) =>
          (user.firstName + " " + user.lastName)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Role Filter
    if (roleFilter !== -999) {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
    }

    // Sort
    if (sortConfig.key) {
      filteredUsers.sort((a, b) => {
        let aKey = a[sortConfig.key];
        let bKey = b[sortConfig.key];

        if (sortConfig.key === "createdAt") {
          aKey = new Date(aKey);
          bKey = new Date(bKey);
        } else {
          aKey = (aKey || "").toString().toLowerCase();
          bKey = (bKey || "").toString().toLowerCase();
        }

        if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filteredUsers;
  }, [users, searchValue, roleFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchValue = (value) => {
    setSearchValue(value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  function renderUsers() {
    return finalUsers.map((user, index) => (
      <tr key={user.id || index}>
        <td>{index + 1}.</td>
        <td className="text-start">{user.firstName + " " + user.lastName}</td>
        <td className="text-start">{user.username}</td>
        <td className="text-start">{user.email}</td>
        <td
          className={`text-start mid-bold ${
            user.role === "Admin" ? "text-success bold" : ""
          }`}
        >
          {user.role}
        </td>
        <td className="text-start">{user.createdAt?.split("T")[0]}</td>
        <td>
          <div className="d-flex gap-2 justify-content-center">
            <Link className="btn btn-sm btn-success" title="View">
              <i className="fas fa-eye"></i>
            </Link>
            <Link className="btn btn-sm btn-outline-success" title="Edit">
              <i className="fas fa-edit"></i>
            </Link>
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
    ));
  }

  if (isLoading) return loadingMessage;
  if (apiError) return apiErrorMessage;

  return (
    <div className={`card ${darkMode ? "spic-dark-mode" : ""}`}>
      <div
        className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
          darkMode ? "spic-dark-mode" : ""
        }`}
      >
        <h5 className="text-center mb-0">
          <strong>Users:</strong>
        </h5>
        <Link
          to="/admin/users/add_user"
          className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
            darkMode ? "spic-dark-mode" : ""
          }`}
        >
          <i className="fas fa-plus me-2"></i>
          Add New User
        </Link>
      </div>

      <div
        className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
          darkMode ? "spic-dark-mode" : ""
        }`}
      >
        <div className="col-12 col-md-6">
          <SearchBar
            darkMode={darkMode}
            handleSearchValue={handleSearchValue}
          />
        </div>
        <div className="col-12 col-md-4 row justify-content-between p-0">
          <div className="col-12 col-md-5 p-0">
            <div className="form-floating" style={{ width: "100%" }}>
              {" "}
              <select
                className={`form-select ${
                  darkMode ? " spic-dark-mode" : ""
                } w-100`}
                value={countPerPage}
                style={{ width: "100%" }}
                onChange={handleCountPerPageMenu}
              >
                {countPerPageValues.map((value, index) => (
                  <option key={index} className="dropdown-item" value={value}>
                    {value}
                  </option>
                ))}
              </select>{" "}
              <label
                style={{ color: `${darkMode ? "#ccc" : ""}` }}
                htmlFor="floatingSelectGrid"
              >
                Users per Page:{" "}
              </label>
            </div>
          </div>
          <div className="col-12 col-md-5 p-0">
            <FilterableDropdown
              darkMode={darkMode}
              items={roles}
              name={"role"}
              filterType={"Select Role:"}
              handleFunction={handleRoleFilter}
              selectedValue={roleFilter}
            />
          </div>
        </div>
      </div>
      <div className="my-4 d-flex justify-content-center">
        <PaginationNav
          darkMode={darkMode}
          counts={users.length}
          pageNo={pageNo}
          setPageNo={setPageNo}
          countPerPage={countPerPage}
        />
      </div>
      <div className="table-responsive text-nowrap">
        <table
          className={`table ${darkMode ? "table-dark" : "table-light"} m-0`}
        >
          <thead>
            <tr>
              <th>#.</th>
              <th className="text-start">Name</th>
              <th className="text-start">Username</th>
              <th className="text-start">Email</th>
              <th
                className="text-start"
                style={{ cursor: "pointer" }}
                onClick={() => requestSort("role")}
              >
                Role{" "}
                {sortConfig.key === "role" ? (
                  sortConfig.direction === "ascending" ? (
                    <i className="fa-solid fa-sort-up" />
                  ) : (
                    <i className="fa-solid fa-sort-down" />
                  )
                ) : (
                  <i className="fa-solid fa-sort" />
                )}
              </th>
              <th
                className="text-start"
                style={{ cursor: "pointer" }}
                onClick={() => requestSort("createdAt")}
              >
                Joining At{" "}
                {sortConfig.key === "createdAt" ? (
                  sortConfig.direction === "ascending" ? (
                    <i className="fa-solid fa-sort-up" />
                  ) : (
                    <i className="fa-solid fa-sort-down" />
                  )
                ) : (
                  <i className="fa-solid fa-sort" />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {finalUsers.length > 0 ? (
              renderUsers()
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="my-4 d-flex justify-content-center">
          <PaginationNav
            darkMode={darkMode}
            counts={users.length}
            pageNo={pageNo}
            setPageNo={setPageNo}
            countPerPage={countPerPage}
          />
        </div>
      </div>
    </div>
  );
}
