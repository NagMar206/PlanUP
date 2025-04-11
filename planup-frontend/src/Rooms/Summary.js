import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/LikedPrograms.css";

function Summary({ apiUrl }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [likedPrograms, setLikedPrograms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roomCode = queryParams.get("room");

        if (!roomCode) {
            setError("⚠️ Hiba: Nem található szobakód.");
            return;
        }

        const fetchLikedPrograms = async () => {
            try {
                const response = await axios.get(`${apiUrl}/rooms/${roomCode}/liked-programs`);
                if (response.data && response.data.length > 0) {
                    setLikedPrograms(response.data);
                } else {
                    setError("Nincsenek kedvelt programok ebben a szobában.");
                }
            } catch (err) {
                console.error("❌ Hiba a szobás kedvelt programok lekérésekor:", err);
                setError("Nem sikerült betölteni a kedvelt programokat.");
            }
        };

        fetchLikedPrograms();
    }, [apiUrl, location.search]);

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="summary-container">
            <h1>Összegzés</h1>
            {error && <p className="error-message">{error}</p>}
            {!error && likedPrograms.length > 0 && (
                <div className="program-list">
                    {likedPrograms.map((program) => (
                        <div key={program.ProgramID} className="program-card">
                            <img
                                src={`${apiUrl}/images/${program.Image}`}
                                alt={program.Name}
                                className="program-image"
                            />
                            <h2>{program.Name}</h2>
                            <p>{program.Description}</p>
                            <p>🌍 Város: {program.CityName}</p>
                            <p>📍 Helyszín: {program.Location}</p>
                            <p>
                                ⏳ Időtartam:{" "}
                                {program.Duration === 1
                                    ? "Fél napos"
                                    : program.Duration === 2
                                    ? "Egész napos"
                                    : program.Duration === 3
                                    ? "Egész hétvégés"
                                    : "Ismeretlen időtartam"}
                            </p>
                            <p>💰 Költség: {program.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
                            <p>👍 Kedvelések száma: {program.likeCount}</p>
                            {program.MoreInfoLink && (
                                <a href={program.MoreInfoLink} target="_blank" rel="noopener noreferrer">
                                    További információ
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <button onClick={handleBack} className="back-button">
                Vissza
            </button>
        </div>
    );
}

export default Summary;
