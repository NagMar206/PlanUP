import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEdit, FaLock, FaSignOutAlt, FaSpinner, FaShieldAlt } from "react-icons/fa";
import "../Style/Profile.css";

function Profile({ user, setUser }) {
  const [username, setUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const welcomeMessages = [
    "Hagyd ránk a tervezést!",
    "Fedezd fel a legjobb programokat!",
    "Válogass több mint egy tucat program közül!",
    "PlanUP: Tervezz velünk!",
    "Sikerült programot választani?",
  ];
  
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  

  useEffect(() => {
    if (!user) return;
  
    axios.get(`http://localhost:3001/profile/${user}`, { withCredentials: true })
      .then((response) => {
        setUsername(response.data.username);
        setIsAdmin(response.data.isAdmin || false); // Ellenőrizzük, hogy admin-e
        setLoading(false);
        const randomMessage =
  welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
setWelcomeMessage(randomMessage);

      })
      .catch((error) => {
        console.error("Hiba a profil lekérésekor:", error);
        setLoading(false);
      });
  }, [user]);
  
  // Ha a felhasználó admin, jelenjen meg az Admin felület gomb
  {isAdmin && (
    <button className="admin-btn" onClick={() => navigate("/admin")}>
      <FaShieldAlt /> Admin felület
    </button>
  )}
  
  

  // Define handleUpdateName
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setMessage("A név nem lehet üres!");
      return;
    }

    try {
      await axios.put(
        "http://localhost:3001/profile/update-name",
        { userId: user, name: newName },
        { withCredentials: true }
      );

      setUsername(newName);
      setNewName("");
      setMessage("Név sikeresen frissítve!");
    } catch (error) {
      console.error("Hiba a névváltoztatáskor:", error);
      setMessage("Hiba történt a név frissítésekor.");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("Mindkét mező kitöltése kötelező!");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/api/auth/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Hiba történt!");
    }
  };

  const handleLogout = async () => {
    try {
      // Send logout request to server
      await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });
      
      // Clear the user state
      setUser(null);
      
      // Show modal
      setShowModal(true); // This triggers the modal
      setTimeout(() => {
        navigate("/login"); // Redirect after 2 seconds
      }, 2000); // 2-second delay for the modal to be visible
    } catch (error) {
      console.error("Hiba a kijelentkezésnél:", error);
      setMessage("Hiba történt a kijelentkezés során.");
    }
  };
  
  const navigateToAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="profile-container">
      <h2><FaUser /> Profil</h2>
      {username && <p className="welcome-message">👋 {welcomeMessage}</p>}

      {loading ? (
        <p className="loading"><FaSpinner className="spinner" /> Betöltés...</p>
      ) : username ? (
        <>
          <div className="profile-card">
            <p><FaUser /> Üdvözlünk <strong>{username}</strong></p>
          </div>
          <div className="profile-actions">
            <input type="text" placeholder="Felhasználó név megváltozatása" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button onClick={handleUpdateName} className="update-btn"><FaEdit /> Név frissítése</button>
          </div>
          <h3><FaLock /> Jelszó módosítása</h3>
          <div className="profile-actions">
            <input type="password" placeholder="Régi jelszó" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="Új jelszó" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleChangePassword} className="password-btn"><FaLock /> Jelszó frissítése</button>
          </div>
          <div className="profile-actions">
              {isAdmin && (
                <button className="admin-btn" onClick={navigateToAdmin}>
                  <FaShieldAlt /> Admin felület
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Kijelentkezés
              </button>
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
