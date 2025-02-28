import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/ProgramSwipe.css";

function ProgramSwipe({ apiUrl, userId }) {
  const [program, setProgram] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ duration: "", cost: "" });
  const [likedPrograms, setLikedPrograms] = useState(new Set());
  const [filterActive, setFilterActive] = useState(false);

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
  try {
    const params = {};

    if (filterActive) {
      if (filters.cost) {
        params.cost = filters.cost === "paid" ? "true" : "false";
      }
      if (filters.duration) {
        params.duration =
          filters.duration === "half_day" ? 1 :
          filters.duration === "whole_day" ? 2 :
          filters.duration === "weekend" ? 3 : undefined;
      }
    }


    const response = await axios.get(`${apiUrl}/programs/random`, { params });

    let fetchedProgram = response.data;

    if (!fetchedProgram || likedPrograms.has(fetchedProgram.ProgramID)) {
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
    setError("Nem sikerült betölteni a programot.");
  }
};


  // Figyeljük, ha a szűrés állapota vagy a filterek változnak
  useEffect(() => {
    fetchFilteredProgram();
  }, [filterActive, filters]);

  // Like/Dislike gombok kezelése
  const handleSwipe = async (action) => {
    if (!program) return;

    try {
      await axios.post(`${apiUrl}/programs/${program.ProgramID}/${action}`, { userId });

      if (action === "like") {
        setLikedPrograms((prev) => new Set([...prev, program.ProgramID]));
      }
      fetchFilteredProgram();
    } catch (err) {
      setError("Nem sikerült végrehajtani a műveletet.");
    }
  };

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
      {!program && <div className="loading">Nincs találat vagy betöltés...</div>}

      {program && (
        <div className="program-card">
          <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
          <h2>{program.Name}</h2>
          <p>{program.Description}</p>
          <p>Helyszín: {program.Location}</p>
          <p>Időtartam: {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}</p>
          <p>Költség: {magyarKoltseg[program.Cost] || "Ismeretlen"}</p>
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
