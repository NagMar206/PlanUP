import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/Profile.css";

function Profile({ user }) {
  const [username, setUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:3001/profile/${user}`, { withCredentials: true })
      .then((response) => {
        setUsername(response.data.username);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Hiba a profil lekérésekor:", error);
        setLoading(false);
      });
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setMessage("⚠️ A név nem lehet üres!");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/profile/update-name",
        { userId: user, name: newName },
        { withCredentials: true }
      );

      setUsername(newName);
      setNewName("");
      setMessage("✅ Név sikeresen frissítve!");
    } catch (error) {
      console.error("❌ Hiba a névváltoztatáskor:", error);
      setMessage("⚠️ Hiba történt a név frissítésekor.");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("⚠️ Mindkét mező kitöltése kötelező!");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/api/auth/change-password", // 🔹 API endpoint
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "⚠️ Hiba történt!");
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 Profil</h2>

      {loading ? (
        <p className="loading">🔄 Betöltés...</p>
      ) : username ? (
        <>
          <p><strong>Felhasználónév:</strong> {username}</p>
          
          {/* Név módosítása */}
          <div className="profile-actions">
            <input
              type="text"
              placeholder="Új név"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleUpdateName}>✏️ Név frissítése</button>
          </div>

          {/* Jelszó módosítása */}
          <div className="profile-actions">
            <h3>🔒 Jelszó módosítása</h3>
            <input
              type="password"
              placeholder="Régi jelszó"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Új jelszó"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>🔄 Jelszó frissítése</button>
          </div>
        </>
      ) : (
        <p>⚠️ Nem található felhasználói adat.</p>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Profile;
