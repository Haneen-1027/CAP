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

  const [visibleList, setVisibleList] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  // Error messages
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

  // Pagination
  const countPerPageValues = [10, 15, 25, 50, 75, 100];
  const [countPerPage, setCountPerPage] = useState(25);
  const [pageNo, setPageNo] = useState(1);
  const [usersCount, setUsersCount] = useState(0);

  // Searching
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Filtiration
  const roles = [
    { name: "All", value: -999 },
    { name: "Admin", value: "Admin" },
    { name: "Company", value: "Company" },
    { name: "Contributor", value: "Contributor" },
  ];
  const [roleFiltiration, setRoleFiltiration] = useState(-999);
  const [timeFilteration, setTimeFilteration] = useState({
    start_date: "2024-01-01",
    end_date: "2025-12-08",
  });

  ///////////////////////// Functions ///////////////////////////////////////////////////////////////////////////
  // Render users
  function renderUsers() {
    return sortedUsers.map((user, index) => (
      <tr key={index}>
        <td>{index < 9 ? "0" + (index + 1) : index + 1}.</td>
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
        <td className="text-start">{user.createdAt.split("T")[0]}</td>
        <td>
          <div className="d-flex gap-2 justify-content-center">
            <Link
              className="btn btn-sm btn-success"
              title="Invite Contributors"
            >
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
  // Sort function
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...visibleList];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let aKey = a[sortConfig.key];
        let bKey = b[sortConfig.key];

        // Handle date parsing for createdAt
        if (sortConfig.key === "createdAt") {
          aKey = new Date(aKey);
          bKey = new Date(bKey);
        } else {
          aKey = aKey.toString().toLowerCase();
          bKey = bKey.toString().toLowerCase();
        }

        if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Toggole sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  /** Pagination Functions */
  const handleCountPerPageMenu = (e) => {
    setCountPerPage(Number(e.target.value));
  };

  /** Searching Functions */
  const handleSearchValue = (value) => {
    if (value.trim() === "") {
      setSearchResults([]);
      setSearchValue(value);
    } else {
      setSearchValue(value);
    }
  };

  /** Filtiration Functions */
  function handleRole(e) {
    setRoleFiltiration(e.target.value);
  }
  const handleDateFilter = (e) => {
    const { name, value } = e.target;
    setTimeFilteration((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  /** Delete Function */
  //////////////////////// use Effects ///////////////////////////////////////////////////////////////////
  // Fetch questionsIds from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setApiError(false);
        const response = await getUsers();
        setUsers(response.data);
        setVisibleList(response.data);
        setUsersCount(response.data.length);
      } catch (error) {
        console.error("Error fetching questionsIds:", error);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Track and debug states
  useEffect(() => {
    console.log("Users List: ", users);
  }, [users]);

  ///// Returns: ////////////////////////////////////////////////////////////////////////////

  if (isLoading) {
    return loadingMessage;
  } else if (apiError) {
    return apiErrorMessage;
  } else {
    return (
      <>
        <div className={`card ${darkMode ? " spic-dark-mode" : ""}`}>
          {/** Primary Header ( Title + Additional Link ) */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          >
            <h5 className="text-center mb-0">
              <strong>Users:</strong>
            </h5>
            <Link
              to="/admin/users/add_user"
              type="button"
              className={`btn btn-light btn-sm d-flex my-2 m-md-0 align-items-center ${
                darkMode ? " spic-dark-mode" : ""
              }`}
            >
              <i className="fas fa-plus me-2"></i>
              Add New User
            </Link>
          </div>
          {/** Search + Filtiration System */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          ></div>
          {/** Pagination */}
          <div
            className={`card-header d-flex flex-column flex-md-row justify-content-between align-items-center ${
              darkMode ? " spic-dark-mode" : ""
            }`}
          ></div>
          {/** Users Table */}
          <div className="table-responsive text-nowrap">
            <table
              className={`table ${
                darkMode ? "table-dark " : "table-light"
              } m-0`}
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
                {Array.isArray(users) && users.length > 0 ? (
                  renderUsers()
                ) : noResults ? (
                  <div>There are no Users yet!</div>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
