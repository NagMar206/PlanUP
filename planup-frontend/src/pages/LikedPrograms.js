import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/ProgramSwipe.css";

function LikedPrograms({ apiUrl, userId }) {
    const [likedPrograms, setLikedPrograms] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    // Ha nincs userId, állítsuk be 1-re (vagy a létező userre)
    const validUserId = userId || 1;
  
    useEffect(() => {
        console.log(`🟢 Aktív userID a frontendben: ${userId}`);

      const fetchLikedPrograms = async () => {
        try {
          const response = await axios.get(`${apiUrl}/programs/liked`, {
            params: { userId: validUserId },
          });
  
          console.log("API válasza:", response.data);
          setLikedPrograms(response.data);
        } catch (err) {
          console.error("Hiba történt a kedvelt programok lekérésekor:", err);
          setError("Nem sikerült betölteni a kedvelt programokat.");
        }
      };
  
      fetchLikedPrograms();
    }, [apiUrl, validUserId]);
  
    const resetLikedPrograms = async () => {
      try {
        await axios.delete(`${apiUrl}/programs/liked/reset`, {
          data: { userId: validUserId },
        });
        setLikedPrograms([]);
        console.log("✅ Kedvelt programok törölve.");
      } catch (err) {
        console.error("❌ Hiba történt a kedvelt programok törlésekor:", err);
        setError("Nem sikerült törölni a kedvelt programokat.");
      }
    };

    return (
      <div className="program-swipe-container">
        <h2>Kedvelt programok összegzése</h2>
  
        {error && <div className="error-message">{error}</div>}
        {likedPrograms.length === 0 && <div className="loading">Nincs kedvelt program.</div>}
  
        {likedPrograms.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
            <h2>{program.Name}</h2>
            <p>{program.Description}</p>
            <p>Helyszín: {program.Location}</p>
            <p>Időtartam: {program.Duration}</p>
            <p>Költség: {program.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
            <p><strong>Kedvelések száma:</strong> {program.LikesCount}</p>
          </div>
        ))}
  
        <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
        <button onClick={resetLikedPrograms} className="reset-button">🔄 Összes kedvelt program törlése</button>
      </div>
    );
}

export default LikedPrograms;