import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/ProgramSwipe.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import FilterComponent from "../components/Filter";
import { useRoom } from "../context/RoomContext";
import { useSocket } from "../context/SocketContext";
import logo from "../images/logo.png";

function RoomSwipe({ apiUrl }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { userId } = useRoom();
  const [localUserId, setLocalUserId] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ duration: "", cost: "", city: "" });
  const [filterActive, setFilterActive] = useState(false);
  const [cities, setCities] = useState([]);

  const socket = useSocket();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/programs/cities/with-programs`
        );
        setCities(response.data);
      } catch (err) {
        console.error("Hiba a városok betöltésekor:", err);
      }
    };
    fetchCities();
  }, [apiUrl]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/rooms/${roomCode}/programs`, {
        withCredentials: true,
      });
      setPrograms(res.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Nem sikerült lekérni a programokat:", err);
      setError("Hiba történt a programok betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [apiUrl, roomCode, filterActive]);

  useEffect(() => {
    if (!socket || !roomCode || !userId) return;

    socket.emit("joinRoom", roomCode, userId);

    socket.on("filterUpdate", () => {
      setFilterActive((prev) => !prev);
    });

    return () => {
      socket.off("filterUpdate");
    };
  }, [socket, roomCode, userId]);

  useEffect(() => {
    if (!userId) {
      axios
        .get(`${apiUrl}/api/auth/status`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.userId) {
            setLocalUserId(res.data.userId);
          }
        })
        .catch((err) => {
          console.error("Nem sikerült lekérni a userID-t:", err);
        });
    }
  }, [userId]);

  const handleSwipe = async (liked) => {
    const currentProgram = programs[currentIndex];
    const finalUserId = userId || localUserId;
    if (!finalUserId || !currentProgram) return;

    try {
      await axios.post(
        `${apiUrl}/summary/choose`,
        {
          roomCode,
          userId: finalUserId,
          programId: currentProgram.ProgramID,
          liked,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Mentési hiba:", err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleEndSwipe = () => {
    navigate(`/summary?room=${roomCode}`);
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (currentIndex >= programs.length) {
    return (
      <div className="program-swipe-container">
        <div className="program-card planup-end-card">
          <img src={logo} className="planup-logo" alt="PlanUp logó" />
          <h2>🎉 Kész vagy!</h2>
          <p>Minden programot értékeltél ebben a szobában.</p>
          <p>Kattints az összegzéshez és nézd meg, mik a közös kedvencek!</p>
          <button className="finish-button" onClick={handleEndSwipe}>
            📊 Összegzés megtekintése
          </button>
        </div>
      </div>
    );
  }

  const program = programs[currentIndex];

  return (
    <div className="program-swipe-container">
     

      <div className="program-card">
        <img
          src={`http://localhost:3001/images/${program.Image}`}
          alt={program.Name}
        />
        <h2>{program.Name}</h2>
        <p className="description">{program.Description}</p>
        <p>
          🌍 <span className="highlighted">{program.CityName}</span>
        </p>
        <p>
          📍 <span className="highlighted">{program.Location}</span>
        </p>
        <p>
          💰{" "}
          <span className="highlighted">
            {program.Cost === 1 ? "Fizetős" : "Ingyenes"}
          </span>
        </p>
        <p>
          ⏳{" "}
          <span className="highlighted">
            {program.Duration === 1
              ? "Fél napos"
              : program.Duration === 2
              ? "Egész napos"
              : "Hétvégés"}
          </span>
        </p>
      </div>

      <div className="swipe-buttons">
        <button
          className="dislike-button animate-dislike"
          onClick={() => handleSwipe(false)}
        >
          <FaTimes /> Nem tetszik
        </button>
        <button
          className="like-button animate-like"
          onClick={() => handleSwipe(true)}
        >
          <FaCheck /> Tetszik
        </button>
      </div>
    </div>
  );
}

export default RoomSwipe;
