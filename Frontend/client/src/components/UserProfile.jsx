import React from "react";

export default function UserProfile({ userDetailes }) {
  return (
    <>
      <div>
        Hello {userDetailes.firstName} {userDetailes.lastName}!
      </div>
    </>
  );
}
