import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Style/LikedPrograms.css"; // Használjuk ugyanazt a stílust, mint a LikedPrograms-nál

function Summary({ apiUrl }) {
  const location = useLocation();
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [error, setError] = useState("");

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const magyarKoltseg = {
    free: "Ingyenes",
    paid: "Fizetős",
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("room");

    if (!roomId) {
      setError("⚠️ Hiba: Nem található szobakód.");
      return;
    }

    const fetchLikedPrograms = async () => {
      try {
        const endpoint = `${apiUrl}/programs/liked?roomId=${roomId}`;
        const response = await axios.get(endpoint, { withCredentials: true });
        setLikedPrograms(response.data);
      } catch (err) {
        console.error("❌ Hiba a kedvelt programok lekérésekor:", err);
        setError("Nem sikerült betölteni a kedvelt programokat.");
      }
    };

    fetchLikedPrograms();
  }, [apiUrl, location.search]);

  return (
    <div className="liked-programs-container">
      <h2 className="liked-title">📊 Szobás Kedvelt Programok</h2>

      {error && <div className="error-message">{error}</div>}
      {likedPrograms.length === 0 && !error && (
        <div className="no-liked">Nincs kedvelt program ebben a szobában.</div>
      )}

      <div className="program-grid">
        {likedPrograms.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img
              src={`http://localhost:3001/images/${program.Image}`}
              alt={program.Name}
              className="program-image"
            />
            <h3>{program.Name}</h3>
            <p>{program.Description}</p>
            <p>🌍 Város: {program.CityName}</p>
            <p>📍 Helyszín: {program.Location}</p>
            <p>
              ⏳ Időtartam:{" "}
              {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}
            </p>
            <p>
              💰 Költség: {magyarKoltseg[program.Cost] || "Ismeretlen költség"}
            </p>
            <p>
              👍 Kedvelések száma:{" "}
              <strong>{program.likeCount || "n/a"}</strong>
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
        <button
          onClick={() => (window.location.href = "/")}
          className="back-button"
        >
          ⬅️ Vissza a főoldalra
        </button>
      </div>
    </div>
  );
}

export default Summary;
