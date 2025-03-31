
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/LikedPrograms.css";

function OnePick({ apiUrl, userId }) {
  const [programs, setPrograms] = useState([]);
  const [isPicking, setIsPicking] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${apiUrl}/programs/liked?userId=${userId}`);
        setPrograms(res.data);
      } catch (err) {
        console.error("Nem sikerült betölteni a programokat:", err);
      }
    };

    fetchPrograms();
  }, [apiUrl, userId]);

  const pickRandomProgram = () => {
    if (!programs.length || isPicking) return;

    setSelectedProgram(null);
    setIsPicking(true);

    let i = 0;
    const interval = setInterval(() => {
      const random = programs[Math.floor(Math.random() * programs.length)];
      setDisplayedName(random.Name);
      i++;
      if (i > 20) {
        clearInterval(interval);
        const winner = programs[Math.floor(Math.random() * programs.length)];
        setSelectedProgram(winner);
        setIsPicking(false);
      }
    }, 80);
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

  return (
    <div className="onepick-container">
      <h2 className="onepick-title">🎯 Válassz nekem egy programot</h2>

      <div className="display-box">
        {isPicking ? <span>{displayedName}</span> : <span>Készen állsz?</span>}
      </div>

      <button className="onepick-button" onClick={pickRandomProgram} disabled={isPicking}>
        {isPicking ? "Kiválasztás folyamatban..." : "🎲 Válassz programot"}
      </button>

      {selectedProgram && (
        <div className="winner-card">
          <img
            src={`http://localhost:3001/images/${selectedProgram.Image}`}
            alt={selectedProgram.Name}
            className="program-image"
          />
          <h3>{selectedProgram.Name}</h3>
          <p>{selectedProgram.Description}</p>
          <p>🌍 Város: {selectedProgram.CityName}</p>
          <p>📍 Helyszín: {selectedProgram.Location}</p>
          <p>⏳ Időtartam: {getIdotartam(selectedProgram.Duration)}</p>
          <p>💰 Költség: {selectedProgram.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
          <a href={selectedProgram.MoreInfoLink} target="_blank" rel="noopener noreferrer">
            <button>További információk</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default OnePick;
