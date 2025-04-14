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
  const { userId } = useRoom(); // Lekérjük a userId-t a RoomContext-ből
  const [localUserId, setLocalUserId] = useState(null); // Lokális fallback userId
  const activeUserId = userId || localUserId; // Aktív userId meghatározása

  // Állapotok
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [filterUpdated, setFilterUpdated] = useState(false);
  const [filters, setFilters] = useState({ duration: "", cost: "", city: "" });
  const [filterActive, setFilterActive] = useState(false);
  const [cities, setCities] = useState([]);

  const socket = useSocket();

  // Városok lekérése
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

  // Host ellenőrzése
  useEffect(() => {
    if (userId) {
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
    }
  }, [apiUrl, roomCode, userId]);

  // Szűrők lekérése nem host felhasználóknak
  useEffect(() => {
    if (!isHost && userId) {
      axios
        .get(`${apiUrl}/rooms/${roomCode}/filters`, { withCredentials: true })
        .then((res) => {
          if (res.data) {
            setFilters(res.data);
            setFilterActive(true);
          }
        })
        .catch((err) => console.error("Nem sikerült lekérni a szűrőket:", err));
    }
  }, [apiUrl, roomCode, isHost, userId]);

  // Programok lekérése
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${apiUrl}/rooms/${roomCode}/programs`, {
          withCredentials: true,
        });
        setPrograms(res.data);
      } catch (err) {
        console.error("Nem sikerült lekérni a programokat:", err);
        setError("Hiba történt a programok betöltésekor.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [apiUrl, roomCode, filterUpdated]);

  // Socket események kezelése
  useEffect(() => {
    if (!socket || !roomCode || !userId) return;

    socket.emit("joinRoom", roomCode, userId);

    socket.on("filterUpdate", () => {
      setFilterUpdated((prev) => !prev);
    });

    return () => {
      socket.off("filterUpdate");
    };
  }, [socket, roomCode, userId]);

  // Auth státusz lekérése lokális fallback-hez
  useEffect(() => {
    if (!userId) {
      axios
        .get(`${apiUrl}/api/auth/status`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.userId) {
            console.log("Lekért userId:", res.data.userId);
            setLocalUserId(res.data.userId);
          } else {
            console.warn("Nem bejelentkezett felhasználó.");
          }
        })
        .catch((err) => {
          console.error("Nem sikerült lekérni a userID-t:", err);
        });
    }
  }, [userId]);

  // Swipe művelet kezelése
  const handleSwipe = async (liked) => {
    const currentProgram = programs[currentIndex];
    if (!activeUserId || !currentProgram) return;

    try {
      if (liked) {
        await axios.post(
          `${apiUrl}/programs/${currentProgram.ProgramID}/like`,
          { userId: activeUserId, roomCode },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${apiUrl}/programs/${currentProgram.ProgramID}/dislike`,
          { userId: activeUserId },
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("Mentési hiba:", err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // Összegzés oldalra navigálás
  const handleEndSwipe = () => {
    navigate(`/summary?room=${roomCode}`);
  };

  // Renderelés állapot szerint
  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (currentIndex >= programs.length) {
    return (
      <div className="program-swipe-container">
        <div className="program-card planup-end-card">
          <img src={logo} className="planup-logo" alt="PlanUp Logo" />
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
      {isHost && (
        <FilterComponent
          filters={filters}
          setFilters={(newFilters) => {
            setFilters(newFilters);
            setFilterActive(true);
            axios.post(
              `${apiUrl}/rooms/${roomCode}/filters`,
              { filters: newFilters, userId },
              { withCredentials: true }
            );
          }}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          cities={cities}
        />
      )}

<div className="program-card">
          <img
            src={`http://localhost:3001/images/${program.Image}`}
            alt={program.Name}
            className="program-image"
          />
          <h2>{program.Name}</h2>
          <p className="description">{program.Description}</p>
          <p>
            🌍 Város: <span className="highlighted">{program.CityName}</span>
          </p>
          <p>
            📍 Helyszín: <span className="highlighted">{program.Location}</span>
          </p>
          <p>
            ⏳ Időtartam:{" "}
            <span className="highlighted">
              {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}
            </span>
          </p>
          <p>
            💰 Költség:{" "}
            <span className="highlighted">
              {magyarKoltseg[program.Cost] || "Ismeretlen"}
            </span>
          </p>
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
