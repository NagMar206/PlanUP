import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 🔹 Axios importálása
import '../Style/Login.css';

function Login({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await axios.post(`${apiUrl}/api/users/login`, { email, password }, { withCredentials: true });
        setUser(response.data.userId);
        navigate('/profile');
      } catch (err) {
        setError("Hibás bejelentkezési adatok!");
      }
    };
  
    return (
      <div className="login-container">
        <h2>Bejelentkezés</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Bejelentkezés</button>
        </form>
      </div>
    );
  }

export default Login;
