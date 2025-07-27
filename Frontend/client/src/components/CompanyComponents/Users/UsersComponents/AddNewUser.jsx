import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaSearch, FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { getUsers } from "../../../../APIs/ApisHandaler"; // Adjust import path as needed
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";

export default function AddNewUser({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setApiLoading(true);
      const res = await getUsers(1, 10, searchTerm, "");
      console.log("Response from fetch users: ", res);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers((prev) => [...prev, { ...user }]);
    }
  };

  const removeUser = (index) => {
    setSelectedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  function handleSubmit() {
    console.log("These are the data that will be send: ", selectedUsers);
  }

  /////
  return (
    <>
      <BackBtn />
      <div className={`card my-4 ${darkMode ? "bg-dark text-light" : ""}`}>
        <div className="card-header mb-4">
          <h1 className="text-center h5 mb-0">
            <strong>Add New Users</strong>
          </h1>
        </div>
        <Row className="mb-3 mx-4">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="success" onClick={fetchUsers}>
                <FaSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <h5 className="mx-4">Search Results:</h5>
        <Table
          striped
          bordered
          responsive
          variant={darkMode ? "dark" : "light"}
        >
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {apiLoading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Loading ...
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onChange={() => toggleUserSelection(user)}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <hr className="my-5" />
        <h5 className="mx-4">Selected Users to Add:</h5>
        {selectedUsers.length === 0 ? (
          <p className="text-center">No users selected.</p>
        ) : (
          <Table
            bordered
            responsive
            striped
            variant={darkMode ? "dark" : "light"}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeUser(index)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {selectedUsers.length > 0 && (
          <Button
            onClick={() => handleSubmit()}
            className="mt-3"
            variant="success"
          >
            <FaPlus className="me-2" />
            Submit Selected Users
          </Button>
        )}
      </div>
    </>
  );
}
