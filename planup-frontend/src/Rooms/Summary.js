import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/LikedPrograms.css";
import Picker from "../components/Picker";

function Summary({ apiUrl }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [error, setError] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const roomCode = queryParams.get("room");

  const getKoltsegSzoveg = (cost) => {
    if (cost === 1 || cost === "paid" || cost === true) return "Fizetős";
    return "Ingyenes";
  };

  useEffect(() => {
    if (!roomCode) {
      setError("Hiba: Nem található szobakód.");
      return;
    }

    const fetchLikedPrograms = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/rooms/${roomCode}/liked-programs`,
          { withCredentials: true }
        );
        console.log("Frontend oldalon kapott programok:", response.data);
        if (response.data && response.data.length > 0) {
          setLikedPrograms(response.data);
        } else {
          setError("Nincsenek kedvelt programok ebben a szobában.");
        }
      } catch (err) {
        console.error("Hiba a szobás kedvelt programok lekérésekor:", err);
        setError("Nem sikerült betölteni a kedvelt programokat.");
      }
    };

    fetchLikedPrograms();
  }, [apiUrl, location.search]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="liked-programs-container">
      <h2 className="liked-title">💙 Szobában kedvelt programok</h2>

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
            <p>
              👍 <span className="highlighted"> {program.likeCount} </span>
            </p>{" "}
            {program.MoreInfoLink && (
              <a
                href={program.MoreInfoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>További információk</button>
              </a>
            )}
          </div>
        ))}
      </div>
      <div>
        <h1>Összegzés</h1>
        {roomCode && <Picker apiUrl={apiUrl} roomCode={roomCode} />}
      </div>
      <div className="button-container">
        <button onClick={handleBack} className="back-button">
          ⬅️ Vissza
        </button>
      </div>
    </div>
  );
}

export default Summary;
