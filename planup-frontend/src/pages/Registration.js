import React, { useState } from 'react';
import axios from 'axios'; // 🔹 Hiányzó import
import '../Style/Auth.css';
import { useNavigate } from 'react-router-dom';

const apiUrl = "http://localhost:3001/api/users"; // 🔹 Javított útvonal!

function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log("Regisztráció indítása...");
    console.log("Küldött adatok:", { email, username, password });

    try {
      const response =fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      console.log("Sikeres regisztráció!", response.data);
      setSuccess("Sikeres regisztráció! Jelentkezz be.");
      navigate('/login');
    } catch (err) {
      console.error("🔥 Regisztrációs hiba:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || "Hiba történt a regisztráció során!");
    }
  };

  return (
    <div className="registration-container">
      <h2>Regisztráció</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegistration}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}

export default Registration;