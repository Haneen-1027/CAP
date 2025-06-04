import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { getUsers, deleteUser } from "../../../../APIs/ApisHandaler";
import Swal from "sweetalert2";

import {
  FilterableDropdown,
  SearchBar,
  PaginationNav,
} from "../../../../componentsLoader/ComponentsLoader";

export default function PreviewUsers({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  //
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
    { name: "All", value: "" },
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];

  const countPerPageValues = [10, 15, 25, 50, 75, 100];

  const handleCountPerPageMenu = (e) => {
    setCountPerPage(Number(e.target.value));
    setPageNo(1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers(
          pageNo,
          countPerPage,
          searchValue,
          roleFilter
        );
        setUsers(response.data.data || []);
        setTotalCount(response.data.pagination.totalCount || 0);
      } catch (err) {
        console.error("Fetching users failed", err);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(
      () => {
        fetchUsers();
      },
      searchValue ? 500 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [pageNo, countPerPage, searchValue, roleFilter]);

  const handleSearchValue = (value) => {
    setSearchValue(value);
    setPageNo(1);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setPageNo(1);
  };

  const resetFilters = () => {
    setSearchValue("");
    setRoleFilter("");
    setPageNo(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  function renderUsers() {
    return users.map((user, index) => (
      <tr key={user.id || index}>
        <td>{(pageNo - 1) * countPerPage + index + 1}.</td>
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
            <Link
              to={`/admin/users/preview_user/${user.id}`}
              className="btn btn-sm btn-success"
              title="View"
            >
              <i className="fas fa-eye"></i>
            </Link>
            <Link
              to={`/admin/users/update_user/${user.id}`}
              className="btn btn-sm btn-outline-success"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              title="Delete"
              onClick={() => deleteUserById(user.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  async function deleteUserById(id) {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete a user and there is no way to retrive his data!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete user!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) {
      await Swal.fire({
        title: "Cancelled",
        text: "User deletion was cancelled.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const res = await deleteUser(id);
      console.log("Result from deletion: ", res);
      await Swal.fire({
        title: "Success!",
        text: "User has been added successfully.",
        icon: "success",
        confirmButtonText: "Great!",
      });
    } catch (error) {
      setApiError(true);
    }
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
        <div>
          <Link
            to="/admin/users/add_user"
            className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
              darkMode ? "spic-dark-mode" : ""
            }`}
          >
            <i className="fas fa-plus me-2"></i>
            Add New User
          </Link>
          {(searchValue || roleFilter) && (
            <button
              onClick={resetFilters}
              className={`btn btn-sm btn-outline-secondary ms-2 ${
                darkMode ? "spic-dark-mode" : ""
              }`}
            >
              <i className="fas fa-filter-circle-xmark me-2"></i>
              Reset Filters
            </button>
          )}
        </div>
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
            value={searchValue}
          />
        </div>
        <div className="col-12 col-md-4 row justify-content-between p-0">
          <div className="col-12 col-md-5 p-0">
            <div className="form-floating" style={{ width: "100%" }}>
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
              </select>
              <label
                style={{ color: `${darkMode ? "#ccc" : ""}` }}
                htmlFor="floatingSelectGrid"
              >
                Users per Page:
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
          counts={totalCount}
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
            {users.length > 0 ? (
              renderUsers()
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {searchValue || roleFilter
                    ? "No users match your search/filters"
                    : "No users found in the system"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
