import React, { useEffect, useState } from "react";

function Footer({ darkMode }) {
  return (
    <footer className={`p-3`}>
      <p className="text-center m-0">
        © 2025 <span className="mid-bold text-success">MENA</span>, Test &
        Assessment. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
