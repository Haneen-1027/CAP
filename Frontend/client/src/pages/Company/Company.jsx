import "./Company.css";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function Company() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
