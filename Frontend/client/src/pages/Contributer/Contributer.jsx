import "./Contributer.css";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function Contributer() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
