import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigáció importálása
import "../Style/ProgramSwipe.css";
import { useRef } from "react"; //useffect fetch hogy ne 2x hivja meg

function ProgramSwipe({ apiUrl, userId }) {
  const [program, setProgram] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ duration: "", cost: "" });
  const [processedPrograms, setProcessedPrograms] = useState(new Set()); // Lájk dislike közös lista
  const [filterActive, setFilterActive] = useState(false);
  const navigate = useNavigate(); // Navigáció kezelése

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const magyarKoltseg = {
    free: "Ingyenes",
    paid: "Fizetős",
  };

  const fetchFilteredProgram = async () => {
    console.log("🟢 fetchFilteredProgram() meghívva...");
  
    try {
      const response = await axios.get(`${apiUrl}/programs/random`);
      let fetchedProgram = response.data;
  
      if (!fetchedProgram) {
        console.log("⚠️ Nincs több elérhető program.");
        setProgram(null);
        return;
      }
  
      let attempts = 0;
      const maxAttempts = 10; // Maximum próbálkozások száma
  
      // ✅ Ha a program már lájkolt vagy dislike-olt, újrapróbálkozunk
      while (processedPrograms.has(fetchedProgram.ProgramID) && attempts < maxAttempts) {
        console.warn(`⚠️ A backend egy már feldolgozott programot adott vissza (ID: ${fetchedProgram.ProgramID}), újrapróbálkozás...`);
        const retryResponse = await axios.get(`${apiUrl}/programs/random`);
        fetchedProgram = retryResponse.data;
        attempts++;
      }
  
      if (!fetchedProgram || processedPrograms.has(fetchedProgram.ProgramID)) {
        console.log("❌ Sikertelen próbálkozások, nincs új program.");
        setProgram(null);
        return;
      }
  
      fetchedProgram.Cost = fetchedProgram.Cost ? "paid" : "free";
      fetchedProgram.Duration = 
    fetchedProgram.Duration === 1 ? "half_day" :
    fetchedProgram.Duration === 2 ? "whole_day" :
    fetchedProgram.Duration === 3 ? "weekend" : fetchedProgram.Duration;

      setProgram(fetchedProgram);
  
      console.log("🎯 Megjelenített program:", fetchedProgram.Name, `(ID: ${fetchedProgram.ProgramID})`);
  
    } catch (err) {
      setError("Nem sikerült betölteni a programot.");
    }
  };
  

  // ✅ Frissített useEffect, hogy ne fusson le kétszer

  const didFetch = useRef(false);
  
  useEffect(() => {
    if (!didFetch.current) {
      console.log("✅ fetchFilteredProgram() lefut egyszer");
      fetchFilteredProgram();
      didFetch.current = true;
    } else {
      console.log("⚠️ fetchFilteredProgram() kihagyva (már lefutott)");
    }
  }, [filterActive, filters]);
  
  
  const handleSwipe = async (action) => {
    if (!program) return;
  
    try {
      console.log(`🔼 Like/dislike küldése: UserID = ${userId}, ProgramID = ${program.ProgramID}, Action = ${action}`);
  
      const response = await axios.post(`${apiUrl}/programs/${program.ProgramID}/${action}`, { userId });
  
      console.log("✅ Like/dislike művelet válasza:", response.data);
  
      // ✅ Egyben kezeljük a like és dislike-olt programokat
      setProcessedPrograms((prev) => new Set([...prev, program.ProgramID]));
  
      fetchFilteredProgram(); // Automatikusan új program betöltése
  
    } catch (err) {
      console.error("❌ Nem sikerült végrehajtani a műveletet:", err);
  
      // ⚠️ Ha a hiba oka az, hogy már like-oltuk, azonnal ugorjunk tovább
      if (err.response && err.response.status === 400) {
        console.warn(`⚠️ A programot már like-olták (ID: ${program.ProgramID}), új program betöltése...`);
        fetchFilteredProgram();
      } else {
        setError("Nem sikerült végrehajtani a műveletet.");
      }
    }
  };
  
 
  
  //most már jobban működik a random, de néha még előfordul hogy 2x megjelenik ugyanaz, de továbblépésnél megfelel
  //dislike-olt programok kezelése (talán megoldja az ismétlődést is!!!)
  
  return (
    <div className="program-swipe-container">
      <div className="filters">
        <select
          value={filters.duration}
          onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
        >
          <option value="">Összes időtartam</option>
          {Object.entries(magyarIdotartam).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        <select
          value={filters.cost}
          onChange={(e) => setFilters({ ...filters, cost: e.target.value })}
        >
          <option value="">Összes költség</option>
          {Object.entries(magyarKoltseg).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        <button onClick={() => {
          setFilterActive(!filterActive);
          fetchFilteredProgram(); 
        }}>
          {filterActive ? "Szűrő kikapcsolása" : "Szűrő alkalmazása"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {!program && (
        <div className="no-program">
          <div className="no-program-box">
            <h2>🎉 Gratulálunk! 🎉</h2>
            <p>Minden elérhető programot végignéztél.</p>
            <p>🔄 Próbálj új keresést, vagy nézz vissza később új lehetőségekért!</p>
            <button className="reload-button" onClick={fetchFilteredProgram}>🔄 Újrapróbálkozás</button>
            <button className="summary-button" onClick={() => navigate("/liked-programs")}>📋 Összegzés megtekintése</button>
          </div>
        </div>
      )}
      {program && (
        <div className="program-card">
          <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
          <h2>{program.Name}</h2>
          <p>{program.Description}</p>
          <p>📍 Helyszín: {program.Location}</p>
          <p>⏳ Időtartam: {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}</p>
          <p>💰 Költség: {magyarKoltseg[program.Cost] || "Ismeretlen"}</p>
        </div>
      )}

      <div className="swipe-buttons">
        <button className="dislike-button" onClick={() => handleSwipe("dislike")}>
          Nem tetszik
        </button>
        <button className="like-button" onClick={() => handleSwipe("like")}>
          Tetszik
        </button>
      </div>
    </div>
  );
}

export default ProgramSwipe;
