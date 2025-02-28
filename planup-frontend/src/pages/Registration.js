import React, { useState } from 'react';
import '../Style/Registration.css';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !username || !password) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sikeres regisztráció! Jelentkezz be.');
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Hiba történt a regisztráció során.');
      }
    } catch (err) {
      setError('Nem sikerült csatlakozni a szerverhez.');
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-box" onSubmit={handleRegistration}>
        <h2>Regisztráció</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input
          type="email"
          placeholder="E-mail cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Felhasználónév"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Regisztráció</button>
        <p className="login-link">
          Már van fiókod? <a href="/login">Bejelentkezés</a>
        </p>
      </form>
    </div>
  );
};

export default Registration;
