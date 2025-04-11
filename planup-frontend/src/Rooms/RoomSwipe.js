import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Style/ProgramSwipe.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import FilterComponent from "../components/Filter";
import { useRoom } from "../context/RoomContext";
import { useSocket } from "../context/SocketContext";
import logo from "../images/logo.png"

function RoomSwipe({ apiUrl }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { userId } = useRoom();
  const [localUserId, setLocalUserId] = useState(null);
  const activeUserId = userId || localUserId;

  // Állapotok és hookok mindig a komponens tetején legyenek!
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [filterUpdated, setFilterUpdated] = useState(false);
  const [filters, setFilters] = useState({ duration: "", cost: "", city: "" });
  const [filterActive, setFilterActive] = useState(false);
  const [cities, setCities] = useState([]);

  // Hookok hívása mindig fix sorrendben történjen!
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

  useEffect(() => {
    if (!isHost && userId) {
      axios.get(`${apiUrl}/rooms/${roomCode}/filters`, { withCredentials: true })
        .then((res) => {
          if (res.data) {
            setFilters(res.data);
            setFilterActive(true);
          }
        })
        .catch(err => console.error("Nem sikerült lekérni a szűrőket:", err));
    }
  }, [apiUrl, roomCode, isHost, userId]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${apiUrl}/rooms/${roomCode}/programs`, {
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
  
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !roomCode || !userId) return;
  
    // Csatlakozás a szobához
    socket.emit("joinRoom", roomCode, userId);
  
    // Frissítés ha változik a szűrő
    socket.on("filterUpdate", () => {
      setFilterUpdated(prev => !prev);
    });
  
    // Takarítás lecsatlakozáskor
    return () => {
      socket.off("filterUpdate");
    };
  }, [socket, roomCode, userId]);

  useEffect(() => {
    if (!userId) {
      axios.get(`${apiUrl}/api/auth/status`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.userId) {
            console.log("🎯 Lekért userId:", res.data.userId);
            setLocalUserId(res.data.userId);
          } else {
            console.warn("⚠️ Nem bejelentkezett felhasználó.");
          }
        })
        .catch((err) => {
          console.error("❌ Nem sikerült lekérni a userID-t:", err);
        });
    }
  }, [userId]);
  

  useEffect(() => {
    if (!userId) {
      axios.get(`${apiUrl}/api/auth/status`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.userId) {
            console.log("🎯 Lekért userId:", res.data.userId);
            setLocalUserId(res.data.userId); // <-- ez a helyes
          } else {
            console.warn("⚠️ Nem bejelentkezett felhasználó.");
          }
        })
        .catch((err) => {
          console.error("❌ Nem sikerült lekérni a felhasználó adatait:", err);
        });
    }
  }, [userId]);
  

  console.log("🧪 RoomSwipe mentéshez userId:", userId);

  const handleSwipe = async (liked) => {
    const currentProgram = programs[currentIndex];
    const finalUserId = userId || localUserId;
    if (!finalUserId) return;
  
    try {
      if (liked) {
        await axios.post(`${apiUrl}/programs/${currentProgram.ProgramID}/like`, {
          userId: finalUserId,
          roomCode
        }, { withCredentials: true });
      } else {
        await axios.post(`${apiUrl}/programs/${currentProgram.ProgramID}/dislike`, {
          userId: finalUserId
        }, { withCredentials: true });
      }
    } catch (err) {
      console.error("❌ Mentési hiba:", err);
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
          <img src={logo} className="planup-logo" />
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
            axios.post(`${apiUrl}/rooms/${roomCode}/filters`, {
              filters: newFilters, userId
            }, { withCredentials: true });
          }}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          cities={cities}
        />
      )}

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