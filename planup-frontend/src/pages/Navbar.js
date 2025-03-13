import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Navbar.css";
import "tachyons/css/tachyons.min.css";

function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link className="navbar-title" to="/">PlanUp</Link>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {!user ? (
          <>
            <li>
              <Link to="/register">Regisztráció</Link>
            </li>
            <li>
              <Link to="/login">Bejelentkezés</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/rooms">Szobák</Link>
            </li>
            <li>
              <Link to="/liked-programs">Kedvelt Programok</Link>
            </li>
            <li>
              <Link to="/profile">Profil</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
