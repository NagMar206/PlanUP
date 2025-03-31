
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/LikedPrograms.css";

function LockedChest({ apiUrl, userId }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/programs/liked`, {
          params: { userId },
        });
        setPrograms(response.data);
      } catch (err) {
        console.error("❌ Hiba a programok betöltésekor:", err);
      }
    };

    fetchPrograms();
  }, [apiUrl, userId]);

  const openChest = () => {
    if (!programs.length || opened) return;

    const random = Math.floor(Math.random() * programs.length);
    setSelectedProgram(programs[random]);
    setOpened(true);
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
    <div className="chest-container">
      <h2 className="chest-title">🔐 Meglepetés Láda</h2>

      <div className={`chest ${opened ? "opened" : ""}`} onClick={openChest}>
        <div className="lid" />
        <div className="box" />
      </div>

      {!opened && (
        <p className="chest-hint">Kattints a ládára, hogy kinyisd!</p>
      )}

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

export default LockedChest;
