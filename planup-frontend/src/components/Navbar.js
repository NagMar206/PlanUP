import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Navbar.css";
import loginImage from "../images/login.jpg";
import logoutImage from "../images/logout.jpg";

function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link className="navbar-title" to="/">
        PlanUp
      </Link>

      {/* Hamburger ikon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Menü tartalom */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {!user ? (
          <>
            <li>
              <Link to="/register">Regisztráció</Link>
            </li>
            <li>
              <Link to="/login">Bejelentkezés</Link>
            </li>
            {/* Profil ikon */}
            <li className="status-icon">
              <Link to="/profile">
                <img src={logoutImage} alt="Profil" />
              </Link>
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
            {/* Profil ikon */}
            <li className="status-icon">
              <Link to="/profile">
                <img src={loginImage} alt="Profil" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
