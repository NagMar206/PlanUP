
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/LikedPrograms.css";

function SlotMachine({ apiUrl, userId }) {
  const [programs, setPrograms] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/programs/liked`, {
          params: { userId }
        });
        setPrograms(response.data);
      } catch (err) {
        console.error("❌ Hiba a programok betöltésekor:", err);
      }
    };

    fetchPrograms();
  }, [apiUrl, userId]);

  const spin = () => {
    if (!programs.length || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * programs.length);
      setResult(programs[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const getIdotartam = (value) => {
    return magyarIdotartam[
      value === 1
        ? "half_day"
        : value === 2
        ? "whole_day"
        : value === 3
        ? "weekend"
        : value
    ] || "Ismeretlen időtartam";
  };

  const getRandomProgram = () => {
    const random = Math.floor(Math.random() * programs.length);
    return programs[random];
  };

  return (
    <div className="slot-machine-visual-container">
      <h2 className="slot-machine-title">🎰 Slot Machine</h2>

      <div className="slot-reels-wrapper">
        {[...Array(3)].map((_, i) => (
          <div className={`slot-reel-box ${isSpinning ? "spinning" : ""}`} key={i}>
            {Array.from({ length: 10 }).map((_, j) => {
              const item = getRandomProgram();
              return (
                <div className="slot-card" key={j}>
                  <img src={`http://localhost:3001/images/${item?.Image}`} alt={item?.Name} />
                  <p>{item?.Name}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button onClick={spin} className="slot-button" disabled={isSpinning}>
        {isSpinning ? "Pörög..." : "Pörgesd meg!"}
      </button>

      {result && (
        <div className="winner-card">
          <img
            src={`http://localhost:3001/images/${result.Image}`}
            alt={result.Name}
            className="program-image"
          />
          <h3>{result.Name}</h3>
          <p>{result.Description}</p>
          <p>🌍 Város: {result.CityName}</p>
          <p>📍 Helyszín: {result.Location}</p>
          <p>⏳ Időtartam: {getIdotartam(result.Duration)}</p>
          <p>💰 Költség: {result.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
          <a href={result.MoreInfoLink} target="_blank" rel="noopener noreferrer">
            <button>További információk</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default SlotMachine;
