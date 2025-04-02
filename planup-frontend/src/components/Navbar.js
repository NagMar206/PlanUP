import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/Navbar.css";
import loginImage from "../images/login.jpg";
import logoutImage from "../images/logout.jpg";
import { TbSwipe } from "react-icons/tb";
import { FaUserPlus, FaSignInAlt, FaHeart } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

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
              <Link to="/register" className="nav-icon-link">
                <FaUserPlus className="nav-icon" />
                <span className="nav-text">Regisztráció</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className="nav-icon-link">
                <FaSignInAlt className="nav-icon" />
                <span className="nav-text">Bejelentkezés</span>
              </Link>
            </li>
            <li className="status-icon">
              <Link to="/profile">
                <img src={logoutImage} alt="Profil" />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/swipe" className="nav-icon-link">
                <TbSwipe className="nav-icon" />
                <span className="nav-text">Programok</span>
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="nav-icon-link">
                <MdMeetingRoom className="nav-icon" />
                <span className="nav-text">Szobák</span>
              </Link>
            </li>
            <li>
              <Link to="/liked-programs" className="nav-icon-link">
                <FaHeart className="nav-icon" />
                <span className="nav-text">Kedvelt</span>
              </Link>
            </li>
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