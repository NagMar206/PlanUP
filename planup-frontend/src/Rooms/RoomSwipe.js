import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/ProgramSwipe.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import Filter from "../components/Filter";

function RoomSwipe({ apiUrl, roomCode, userId }) {
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [filterUpdated, setFilterUpdated] = useState(false);

  // Lekérdezzük, hogy a felhasználó host-e
  useEffect(() => {
    const checkHost = async () => {
      try {
        const res = await axios.get(`${apiUrl}/rooms/${roomCode}/creatorId`);
        if (res.data.creatorId === userId) {
          setIsHost(true);
        }
      } catch (err) {
        console.error("Nem sikerült ellenőrizni a host jogosultságot:", err);
      }
    };
    checkHost();
  }, [apiUrl, roomCode, userId]);

  // Programok betöltése
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${apiUrl}/rooms/programs?roomCode=${roomCode}`, {
          withCredentials: true,
        });
        setPrograms(res.data);
      } catch (err) {
        console.error("❌ Nem sikerült lekérni a programokat:", err);
        setError("Hiba történt a programok betöltésekor.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [apiUrl, roomCode, filterUpdated]);

  // WebSocket: Frissítés ha a host szűr
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001/ws/room/${roomCode}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "filterUpdate") {
        setFilterUpdated((prev) => !prev);
      }
    };
    return () => socket.close();
  }, [roomCode]);

  const handleSwipe = async (liked) => {
    if (!programs[currentIndex]) return;
    const currentProgram = programs[currentIndex];

    try {
      await axios.post(`${apiUrl}/summary/choose`, {
        roomCode,
        userId,
        programId: currentProgram.ProgramID,
        liked,
      }, { withCredentials: true });

    } catch (err) {
      console.error("❌ Mentési hiba:", err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (currentIndex >= programs.length) {
    return (
      <div className="no-program-card">
        <h2>Minden programot értékeltél a szobában 🎉</h2>
      </div>
    );
  }

  const program = programs[currentIndex];

  return (
    <div className="program-swipe-container">
      {isHost && <Filter roomMode={true} apiUrl={apiUrl} roomCode={roomCode} />}

      <div className="program-card">
        <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} />
        <h2>{program.Name}</h2>
        <p className="description">{program.Description}</p>
        <p>📍 {program.Location} – {program.CityName}</p>
        <p>💰 {program.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
        <p>⏳ {
          program.Duration === 1 ? "Fél napos" :
          program.Duration === 2 ? "Egész napos" :
          "Hétvégés"
        }</p>
      </div>

      <div className="swipe-buttons">
        <button className="dislike-button" onClick={() => handleSwipe(false)}>
          <FaTimes /> Nem
        </button>
        <button className="like-button" onClick={() => handleSwipe(true)}>
          <FaCheck /> Igen
        </button>
      </div>
    </div>
  );
}

export default RoomSwipe;
