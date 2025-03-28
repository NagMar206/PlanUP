import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/Auth.css'; // Gondoskodj róla, hogy a CSS fájl megfelelő legyen!

function Login({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', 
                { email, password },
                { withCredentials: true }
            );
            setUser(response.data.userId);
            setSuccess('Sikeres bejelentkezés! Átirányítás...');
            setTimeout(() => navigate('/swipe'), 2000); // 2 másodperc után átirányítás
        } catch (err) {
            setError('Hibás bejelentkezési adatok!');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Bejelentkezés</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Bejelentkezés</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
}

export default Login;
