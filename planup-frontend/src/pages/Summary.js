import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Style/LikedPrograms.css"; // Ugyanaz a design, mint a kedvelt programoknál

function Summary({ apiUrl }) {
    const location = useLocation();
    const [likedPrograms, setLikedPrograms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roomCode = queryParams.get("room"); // 🔥 FIGYELEM: RoomCode van itt, nem RoomID!

        if (!roomCode) {
            setError("⚠️ Hiba: Nem található szobakód.");
            return;
        }

        const fetchRoomIdAndLikedPrograms = async () => {
            try {
                console.log(`🔍 Lekérjük a szobához tartozó RoomID-t (RoomCode: ${roomCode})`);

                // 🔥 Először lekérdezzük a RoomID-t a RoomCode alapján
                const roomResponse = await axios.get(`${apiUrl}/rooms/getRoomId?roomCode=${roomCode}`, { withCredentials: true });

                if (!roomResponse.data || !roomResponse.data.RoomID) {
                    setError("❌ A szoba nem található.");
                    return;
                }

                const roomId = roomResponse.data.RoomID;

                console.log(`✅ A RoomCode-hoz tartozó RoomID: ${roomId}`);

                // 🔥 Most már a RoomID-t használjuk a kedvelt programok lekéréséhez
                const response = await axios.get(`${apiUrl}/programs/liked?roomId=${roomId}`, { withCredentials: true });

                if (!response.data || response.data.length === 0) {
                    setError("Nincsenek kedvelt programok ebben a szobában.");
                } else {
                    setLikedPrograms(response.data);
                }
            } catch (err) {
                console.error("❌ Hiba a szobás kedvelt programok lekérésekor:", err);
                setError("Nem sikerült betölteni a kedvelt programokat.");
            }
        };

        fetchRoomIdAndLikedPrograms();
    }, [apiUrl, location.search]);

    return (
        <div className="summary-container">
            <h2>📊 Szobás Kedvelt Programok</h2>

            {error && <div className="error-message">{error}</div>}
            {likedPrograms.length === 0 && !error && (
                <div className="no-liked">Nincs kedvelt program ebben a szobában.</div>
            )}

            <div className="program-grid">
                {likedPrograms.map((program) => (
                    <div key={program.ProgramID} className="program-card">
                        <img
                            src={`http://localhost:3001/images/${program.Image}`}
                            alt={program.Name}
                            className="program-image"
                        />
                        <h3>{program.Name}</h3>
                        <p>{program.Description}</p>
                        <p>🌍 Város: {program.CityName}</p>
                        <p>📍 Helyszín: {program.Location}</p>
                        <p>👍 Kedvelések száma: {program.likeCount || "n/a"}</p>
                        <a
                            href={program.MoreInfoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button>További információk</button>
                        </a>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button
                    onClick={() => (window.location.href = "/")}
                    className="back-button"
                >
                    ⬅️ Vissza a főoldalra
                </button>
            </div>
        </div>
    );
}

export default Summary;
