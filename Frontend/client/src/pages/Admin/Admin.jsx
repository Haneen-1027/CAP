import "./Admin.css";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
