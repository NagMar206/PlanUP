import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/LikedPrograms.css";
import Picker from "../components/Picker";

function LikedPrograms({ apiUrl, userId }) {
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const getKoltsegSzoveg = (cost) => {
    if (cost === 1 || cost === "paid" || cost === true) return "Fizetős";
    return "Ingyenes";
  };

  const validUserId = userId || 1;

  useEffect(() => {
    const fetchLikedPrograms = async () => {
      try {
        const endpoint = `${apiUrl}/programs/liked?userId=${validUserId}`;
        const response = await axios.get(endpoint, { withCredentials: true });
        setLikedPrograms(response.data);
      } catch (err) {
        console.error("Hiba a kedvelt programok lekérésekor:", err);
        setError("Nem sikerült betölteni a kedvelt programokat.");
      }
    };

    fetchLikedPrograms();
  }, [apiUrl, validUserId]);

  const resetLikedPrograms = async () => {
    try {
      const endpoint = `${apiUrl}/programs/liked/reset`;
      const data = { userId: validUserId };

      await axios.delete(endpoint, { data });
      setLikedPrograms([]);
      console.log("Kedvelt programok törölve.");
    } catch (err) {
      console.error("Hiba történt a kedvelt programok törlésekor:", err);
      setError("Nem sikerült törölni a kedvelt programokat.");
    }
  };

  return (
    <div className="liked-programs-container">
      <h2 className="liked-title">💙 Kedvelt programok (Saját)</h2>

      {error && <div className="error-message">{error}</div>}
      {likedPrograms.length === 0 && (
        <div className="no-liked">Nincs kedvelt program.</div>
      )}

      <div className="program-grid">
        {likedPrograms.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img
              src={`http://localhost:3001/images/${program.Image}`}
              alt={program.Name}
              className="program-image"
            />
             <h3><span className="highlighted">{program.Name}</span></h3>
            <p><span className="highlighted">{program.Description}</span></p>
            <p>🌍 Város: <span className="highlighted">{program.CityName}</span></p>
            <p>📍 Helyszín: <span className="highlighted">{program.Location}</span></p>
            <p>
              ⏳ Időtartam:{" "}
              <span className="highlighted">{program.Duration === 1
                ? "Fél napos"
                : program.Duration === 2
                ? "Egész napos"
                : program.Duration === 3
                ? "Egész hétvégés"
                : "Ismeretlen időtartam"}
                </span>
            </p>
            <p>
              💰{" "}
              <span className="highlighted">
                {" "}
                {getKoltsegSzoveg(program.Cost)}
              </span>
            </p>
            <a
              href={program.MoreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
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

      {likedPrograms.length > 0 ? (
        <Picker apiUrl={apiUrl} userId={validUserId} />
      ) : (
        <p className="no-programs-message">
          Lájkold a programokat, hogy pörgethess! 😊
        </p>
      )}
    </div>
  );
}

export default LikedPrograms;
