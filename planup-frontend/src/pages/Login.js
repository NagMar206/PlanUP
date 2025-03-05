import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 🔹 Axios importálása
import '../Style/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authStatus, setAuthStatus] = useState(null); // 🔹 Új state az auth státuszhoz
    const navigate = useNavigate();

    // 🔹 Ellenőrizzük a bejelentkezési státuszt, amikor a komponens betöltődik
    useEffect(() => {
        axios.get("http://localhost:3001/api/auth/status", { withCredentials: true })
            .then(response => {
                console.log("Auth status:", response.data);
                setAuthStatus(response.data);
            })
            .catch(error => console.error("Auth error:", error));
    }, []); // 🔹 Ez csak egyszer fut le, amikor a komponens betöltődik

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // 🔹 Töröljük az előző hibaüzenetet

        try {
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 🔹 Engedélyezi a sütik és az authentikációs információk küldését
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Sikertelen bejelentkezés');
            }

            console.log('Sikeres bejelentkezés:', data);
            navigate('/rooms'); // 🔹 Bejelentkezés után átirányítás a szobák oldalra
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Bejelentkezés</h2>
            {authStatus && <p>{authStatus.loggedIn ? "✅ Bejelentkezve" : "❌ Nincs bejelentkezve"}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <label htmlFor="email">E-mail cím:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Add meg az e-mail címed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Jelszó:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Add meg a jelszavad"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Bejelentkezés</button>
            </form>
        </div>
    );
}

export default Login;
