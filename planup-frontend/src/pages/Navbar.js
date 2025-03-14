import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Navbar.css";
import loginImage from ""; // Bejelentkezés nélküli kép
import logoutImage from ""; // Bejelentkezett kép

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

      {/* Állapotjelző kép */}
      <div className="status-icon">
        <img src={user ? logoutImage : loginImage} alt="User Status" />
      </div>
    </nav>
  );
}

export default Navbar;
