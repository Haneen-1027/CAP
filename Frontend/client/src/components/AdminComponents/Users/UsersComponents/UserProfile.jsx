import React, { useEffect, useState } from "react";
import { BackBtn } from "../../../../componentsLoader/ComponentsLoader";
import { getUserByID } from "../../../../APIs/ApisHandaler";
import { useParams } from "react-router";

export default function PlayerProfile({ darkMode }) {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

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
  useEffect(() => {
    async function fetchUser() {
      if (!id) return; // Defensive check
      try {
        setApiError(false);
        setIsLoading(true);
        const response = await getUserByID(id);
        setUser(response.data || {});
      } catch (err) {
        console.error("Fetching users failed", err);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  useEffect(() => {
    console.log("use:: ", user);
  }, [user]);
  ////

  if (isLoading) {
    return loadingMessage;
  } else if (apiError) {
    return apiErrorMessage;
  } else
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
                    <h5 className="my-3">
                      {user?.firstName} {user?.lastName}
                    </h5>
                    <p className="text-muted mb-1">{user?.userName}</p>
                    <p className="text-muted mb-1">{user?.role}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Full Name</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {" "}
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        {" "}
                        <p className="mb-0">Email</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{user?.email}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Birth Date</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {user?.dateOfBirth?.split("T")[0]}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Joining At</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {user?.createdAt?.split("T")[0]}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
