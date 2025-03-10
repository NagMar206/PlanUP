import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Style/Navbar.css";
import "tachyons/css/tachyons.min.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/status", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <nav className="navbar">
      {/* Title or Logo */}
      
      <Link className="navbar-title" to="/">PlanUp</Link>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/register">Regisztráció</Link>
            </li>
            <li>
              <Link to="/login">Bejelentkezés</Link>
            </li>
            <li>
              <Link to="/rooms">Szobák</Link>
            </li>
            <li>
              <Link to="/liked-programs">Kedvelt Programok</Link>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default Navbar;
