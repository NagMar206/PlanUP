import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Summary({ apiUrl }) {
    const location = useLocation();
    const [likedPrograms, setLikedPrograms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roomId = queryParams.get("room");

        if (!roomId) {
            setError("⚠️ Hiba: Nem található szobakód.");
            return;
        }

        const fetchLikedPrograms = async () => {
            try {
                console.log(`🔍 Lekérjük a szobás kedvelt programokat (RoomID: ${roomId})`);
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

        fetchLikedPrograms();
    }, [apiUrl, location.search]);

    return (
        <div className="summary-container">
            <h2>📊 Szobás Kedvelt Programok</h2>

            {error && <div className="error-message">{error}</div>}

            {likedPrograms.length === 0 && !error ? (
                <p>🔄 Betöltés...</p>
            ) : (
                <ul>
                    {likedPrograms.map((program) => (
                        <li key={program.ProgramID}>{program.Name}</li>
                    ))}
                </ul>
            )}

            <button onClick={() => window.location.href = "/"} className="back-button">
                ⬅️ Vissza a főoldalra
            </button>
        </div>
    );
}

export default Summary;
