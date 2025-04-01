import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/ProgramSwipe.css";
import { useRoom } from "../context/RoomContext";
import { useSocket } from "../context/SocketContext";
import FilterComponent from "../components/Filter";
import logo from "../images/logo.png"

function ProgramSwipe({ apiUrl, userId }) {
  const { roomId } = useRoom();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ duration: "", cost: "", city: "" });
  const [processedPrograms, setProcessedPrograms] = useState(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
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
      fetchedProgram.Duration = fetchedProgram.Duration === 1 ? "half_day" : fetchedProgram.Duration === 2 ? "whole_day" : fetchedProgram.Duration === 3 ? "weekend" : fetchedProgram.Duration;
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
      console.log(`🔼 ${action.toUpperCase()} küldése: UserID = ${userId}, ProgramID = ${program.ProgramID}, RoomID = ${roomId || "Nincs"}`);
      const endpoint = action === 'like' ? 'like' : 'dislike';
      const response = await axios.post(`${apiUrl}/programs/${program.ProgramID}/${endpoint}`, {
        userId,
        programId: program.ProgramID,
        roomCode: roomId || null
      });
      console.log(`✅ ${action.toUpperCase()} művelet válasza:`, response.data);
      setProcessedPrograms((prev) => new Set([...prev, program.ProgramID]));
      fetchFilteredProgram();
    } catch (err) {
      console.error(`❌ Nem sikerült végrehajtani a ${action} műveletet:`, err);
      if (err.response && err.response.status === 400) {
        fetchFilteredProgram();
      } else {
        setError(`Nem sikerült végrehajtani a ${action} műveletet.`);
      }
    }
  };

  const handleEndSwipe = () => {
    if (roomId) {
      console.log(`🔄 Szobás válogatás vége, átirányítás a Summary oldalra. RoomID: ${roomId}`);
      navigate(`/summary?room=${roomId}`);
    } else {
      console.log("🔄 Egyéni válogatás vége, átirányítás a LikedPrograms oldalra.");
      navigate(`/liked-programs`);
    }
  };

  return (
    <div className="program-swipe-container">
      <FilterComponent
        filters={filters}
        setFilters={setFilters}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
        cities={cities}
        
      />
      {error && <div className="error-message">{error}</div>}
      {!program && (
        <div className="program-card no-program-card">
          <img src={logo} className="planup-logo" />
          <h2>🎉 <span style={{ color: "#a855f7" }}>Gratulálunk!</span> 🎉</h2>
          <p>Minden elérhető programot végignéztél.</p>
          <p>🔄 Próbálj új keresést, vagy nézz vissza később új lehetőségekért!</p>
          <div className="end-buttons">
            <button className="reload-button" onClick={fetchFilteredProgram}>🔄 Újrapróbálkozás</button>
            <button onClick={handleEndSwipe} className="finish-button">🎯 Összegzés</button>
          </div>
        </div>
      )}

      {program && (
        <div className="program-card">
          <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
          <h2>{program.Name}</h2>
          <p className="description">{program.Description}</p>
          <p>🌍 Város: <span className="highlighted">{program.CityName}</span></p>
          <p>📍 Helyszín: <span className="highlighted">{program.Location}</span></p>
          <p>⏳ Időtartam: <span className="highlighted">{magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}</span></p>
          <p>💰 Költség: <span className="highlighted">{magyarKoltseg[program.Cost] || "Ismeretlen"}</span></p>
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