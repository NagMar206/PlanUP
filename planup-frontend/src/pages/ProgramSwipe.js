import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/ProgramSwipe.css";
import { useRoom } from "../context/RoomContext"; // Szoba kontextus importálása
import { useSocket } from "../context/SocketContext";



function ProgramSwipe({ apiUrl, userId }) {
  const { roomId } = useRoom(); // Szoba azonosító lekérése
  const [program, setProgram] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ duration: "", cost: "", city: "" });
  const [processedPrograms, setProcessedPrograms] = useState(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  //const didFetch = useRef(false);
  const socket = useSocket();

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
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/programs/cities`);
        setCities(response.data);
      } catch (err) {
        console.error("Hiba a városok betöltésekor:", err);
      }
    };

    fetchCities();
  }, [apiUrl]);

  const fetchFilteredProgram = async () => {
    try {
      const params = {};
      if (filterActive) {
        if (filters.duration) params.duration = filters.duration;
        if (filters.cost) params.cost = filters.cost;
        if (filters.city) params.city = filters.city;
      }

      const response = await axios.get(`${apiUrl}/programs/random`, { params });
      let fetchedProgram = response.data;

      if (!fetchedProgram) {
        setProgram(null);
        return;
      }

      let attempts = 0;
      const maxAttempts = 10;

      while (processedPrograms.has(fetchedProgram.ProgramID) && attempts < maxAttempts) {
        const retryResponse = await axios.get(`${apiUrl}/programs/random`, { params });
        fetchedProgram = retryResponse.data;
        attempts++;
      }

      if (!fetchedProgram || processedPrograms.has(fetchedProgram.ProgramID)) {
        setProgram(null);
        return;
      }

      fetchedProgram.Cost = fetchedProgram.Cost ? "paid" : "free";
      fetchedProgram.Duration =
        fetchedProgram.Duration === 1 ? "half_day" :
        fetchedProgram.Duration === 2 ? "whole_day" :
        fetchedProgram.Duration === 3 ? "weekend" : fetchedProgram.Duration;

      setProgram(fetchedProgram);
    } catch (err) {
      console.error("Hiba a program betöltésekor:", err);
      setError("Nem sikerült betölteni a programot.");
    }
  };

  useEffect(() => {
    fetchFilteredProgram();
  }, [filterActive, filters.duration, filters.cost, filters.city]);

  const handleSwipe = async (action) => {
    if (!program) return;

    try {
        console.log(`🔼 Like/dislike küldése: UserID = ${userId}, ProgramID = ${program.ProgramID}, RoomID = ${roomId || "Nincs"}`);

        const response = await axios.post(`${apiUrl}/programs/${program.ProgramID}/like`, { 
            userId, 
            programId: program.ProgramID,
            roomId: roomId || null // ✅ Ha van szobakód, akkor elküldi, ha nincs, akkor null
        });

        console.log("✅ Like/dislike művelet válasza:", response.data);

        setProcessedPrograms((prev) => new Set([...prev, program.ProgramID]));
        fetchFilteredProgram();
    } catch (err) {
        console.error("❌ Nem sikerült végrehajtani a műveletet:", err);

        if (err.response && err.response.status === 400) {
            fetchFilteredProgram();
        } else {
            setError("Nem sikerült végrehajtani a műveletet.");
        }
    }
};

      const handleEndSwipe = () => {
        if (roomId) {
            console.log(`🔄 Szobás válogatás vége, átirányítás a Summary oldalra. RoomID: ${roomId}`);
            navigate(`/summary?room=${roomId}`); // 🔥 Szobás pörgetés után a Summary oldalra megy
        } else {
            console.log("🔄 Egyéni válogatás vége, átirányítás a LikedPrograms oldalra.");
            navigate(`/liked-programs`); // 🔥 Egyéni válogatás végén a LikedPrograms oldalra megy
        }
      };


  return (
    <div className="program-swipe-container">
      <div className="filters">
        <select value={filters.duration} onChange={(e) => setFilters({ ...filters, duration: e.target.value })}>
          <option value="">Összes időtartam</option>
          {Object.entries(magyarIdotartam).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        <select value={filters.cost} onChange={(e) => setFilters({ ...filters, cost: e.target.value })}>
          <option value="">Összes költség</option>
          {Object.entries(magyarKoltseg).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
          <option value="">Összes város</option>
          {cities.map((city) => (
            <option key={city.CityID} value={city.CityID}>{city.Name}</option>
          ))}
        </select>

        <button onClick={() => setFilterActive(!filterActive)}>
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
            <button onClick={handleEndSwipe} className="finish-button">🎯 Összegzés</button>
          </div>
        </div>
      )}
      {program && (
        <div className="program-card">
          <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
          <h2>{program.Name}</h2>
          <p>{program.Description}</p>
          <p>🌍 Város: {program.CityName}</p>
          <p>📍 Helyszín: {program.Location}</p>
          <p>⏳ Időtartam: {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}</p>
          <p>💰 Költség: {magyarKoltseg[program.Cost] || "Ismeretlen"}</p>
        </div>
      )}

      <div className="swipe-buttons">
        <button className="dislike-button" onClick={() => handleSwipe("dislike")}>Nem tetszik</button>
        <button className="like-button" onClick={() => handleSwipe("like")}>Tetszik</button>
      </div>
    </div>
  );
}

export default ProgramSwipe;
