import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Navbar.css';
import 'tachyons/css/tachyons.min.css';

function Navbar() {
    return (
        <nav className="pa2 flex justify-between items-center">
            <div>
                <Link className="link dim white b f6 dib mr2" to="/" title="Site Name">
                    Site Name
                </Link>
                <Link className="link dim white f6 dib mr2" to="/" title="Home">
                    Home
                </Link>
                <Link className="link dim white f6 dib mr2" to="/register" title="Register">
                    Register
                </Link>
                <Link className="link dim white f6 dib mr2" to="/login" title="Login">
                    Login
                </Link>
                <Link className="link dim white f6 dib" to="/rooms" title="Rooms">
                    Rooms
                </Link>
            </div>
            <div className="pa2">
                <img
                    src="../"
                    className="br-100 ba h2 w2 dib"
                    alt="avatar"
                />
            </div>
        </nav>
    );
}

export default Navbar;