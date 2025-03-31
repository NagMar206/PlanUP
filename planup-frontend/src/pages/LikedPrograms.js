import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/LikedPrograms.css"; // Új CSS fájl a gridhez
import SlotMachine from "../components/SlotMachine";

function LikedPrograms({ apiUrl, userId }) {
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const validUserId = userId || 1; // Ha nincs userId, állítsuk be 1-re

  useEffect(() => {
    const fetchLikedPrograms = async () => {
      try {
        const endpoint = `${apiUrl}/programs/liked?userId=${validUserId}`; // Egyéni like-ok lekérése
        const response = await axios.get(endpoint, { withCredentials: true });
        setLikedPrograms(response.data);
      } catch (err) {
        console.error("❌ Hiba a kedvelt programok lekérésekor:", err);
        setError("Nem sikerült betölteni a kedvelt programokat.");
      }
    };

    fetchLikedPrograms();
  }, [apiUrl, validUserId]);

  const resetLikedPrograms = async () => {
    try {
      const endpoint = `${apiUrl}/programs/liked/reset`; // Egyéni törlés
      const data = { userId: validUserId }; // Egyéni esetben userId kell

      await axios.delete(endpoint, { data });
      setLikedPrograms([]);
      console.log("✅ Kedvelt programok törölve.");
    } catch (err) {
      console.error("❌ Hiba történt a kedvelt programok törlésekor:", err);
      setError("Nem sikerült törölni a kedvelt programokat.");
    }
  };

  return (
    <div className="liked-programs-container">
      <h2 className="liked-title">💙 Kedvelt programok (Saját)</h2>

      {error && <div className="error-message">{error}</div>}
      {likedPrograms.length === 0 && <div className="no-liked">Nincs kedvelt program.</div>}

      <div className="program-grid">
        {likedPrograms.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
            <h3>{program.Name}</h3>
            <p>{program.Description}</p>
            <p>🌍 Város: {program.CityName}</p>
            <p>📍 Helyszín: {program.Location}</p>

            <p>
              ⏳ Időtartam:{" "}
              {magyarIdotartam[
                program.Duration === 1
                  ? "half_day"
                  : program.Duration === 2
                  ? "whole_day"
                  : program.Duration === 3
                  ? "weekend"
                  : program.Duration
              ] || "Ismeretlen időtartam"}
            </p>
            <p>💰 Költség: {program.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
            <a href={program.MoreInfoLink} target="_blank" rel="noopener noreferrer">
              <button>További információk</button>
            </a>
          </div>
        ))}
      </div>

      <div className="button-container">
        <button onClick={() => navigate("/")} className="back-button">
          ⬅️ Vissza a főoldalra
        </button>
        <button onClick={resetLikedPrograms} className="reset-button">
          🔄 Összes kedvelt program törlése
        </button>
      </div>

      {/* 🔥 LuckyWheel csak akkor jelenik meg, ha vannak programok */}
      {likedPrograms.length > 0 ? (
        <SlotMachine apiUrl={apiUrl} userId={validUserId} />
      ) : (
        <p className="no-programs-message">⚠️ Lájkold a programokat, hogy pörgethess! 😊</p>
      )}
    </div>
  );
}

export default LikedPrograms;
