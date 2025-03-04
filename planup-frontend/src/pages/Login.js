import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
