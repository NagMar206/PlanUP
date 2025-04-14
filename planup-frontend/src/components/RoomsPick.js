import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/LikedPrograms.css";

function RoomsPick({ apiUrl, roomCode }) {
  const [programs, setPrograms] = useState([]);
  const [isPicking, setIsPicking] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Kedvelt programok lekérése az adott szobához
  useEffect(() => {
    const fetchLikedPrograms = async () => {
      if (!roomCode) {
        console.error("Nincs szobakód megadva!");
        return;
      }
      try {
        // Az adott szoba kedvelt programjainak lekérése
        const res = await axios.get(`${apiUrl}/rooms/${roomCode}/liked-programs`, {
          withCredentials: true,
        });
        if (res.data && res.data.length > 0) {
          setPrograms(res.data); // Kedvelt programok beállítása
        } else {
          console.warn("Nincsenek kedvelt programok ebben a szobában.");
        }
      } catch (err) {
        console.error("Nem sikerült betölteni a kedvelt programokat:", err);
      }
    };
    fetchLikedPrograms();
  }, [apiUrl, roomCode]);

  // Véletlenszerű program kiválasztása
  const pickRandomProgram = () => {
    if (!programs.length || isPicking) return; // Ne induljon újra, ha már folyamatban van
    setSelectedProgram(null); // Reseteljük az előző választást
    setIsPicking(true); // Indítsuk el a kiválasztási folyamatot

    let i = 0;
    const interval = setInterval(() => {
      const random = programs[Math.floor(Math.random() * programs.length)];
      setDisplayedName(random.Name); // Véletlenszerű név megjelenítése
      i++;
      if (i > 20) { // 20 iteráció után állítsuk le
        clearInterval(interval);
        const winner = programs[Math.floor(Math.random() * programs.length)];
        setSelectedProgram(winner); // Végleges választás
        setIsPicking(false);
      }
    }, 80); // Gyors váltás az animációhoz
  };

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const getIdotartam = (value) => {
    return (
      magyarIdotartam[
        value === 1 ? "half_day" : value === 2 ? "whole_day" : value === 3 ? "weekend" : value
      ] || "Ismeretlen időtartam"
    );
  };

  return (
    <div className="rooms-pick-container">
      <h2 className="rooms-pick-title">Véletlenszerű program kiválasztása</h2>
      {selectedProgram ? (
        <div className="rooms-display-box">
          <h3>🎉 Kiválasztott program:</h3>
          <p>{selectedProgram.Name}</p>
          <p>{selectedProgram.Description}</p>
          <p>📍 Helyszín: {selectedProgram.Location}</p>
          <p>💰 Költség: {selectedProgram.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
        </div>
      ) : (
        <p className="rooms-display-box">{isPicking ? `Véletlenszerű kiválasztás folyamatban... (${displayedName})` : "Nyomd meg a gombot!"}</p>
      )}
      <button className="rooms-pick-button" onClick={pickRandomProgram} disabled={isPicking || !programs.length}>
        Véletlenszerű program kiválasztása
      </button>
    </div>
  );
  
}

export default RoomsPick;
