import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/LikedPrograms.css"; // Új CSS fájl a gridhez
import LuckyWheel from "./LuckyWheel";
import { useRoom } from "../context/RoomContext"; // Szobakezelés importálása

function LikedPrograms({ apiUrl, userId }) {
    const { roomId } = useRoom(); // Szoba azonosító lekérése
    const [likedPrograms, setLikedPrograms] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const magyarIdotartam = {
        half_day: "Fél napos",
        whole_day: "Egész napos",
        weekend: "Egész hétvégés",
    };

    const validUserId = userId || 1; // Ha nincs userId, állítsuk be 1-re

    useEffect(() => {
        console.log(`🟢 Aktív userID a frontendben: ${validUserId}, RoomID: ${roomId || "Nincs"}`);

        const fetchLikedPrograms = async () => {
            try {
                const endpoint = roomId
                    ? `${apiUrl}/api/room/${roomId}/liked-programs` // Szobás API hívás
                    : `${apiUrl}/programs/liked`; // Egyéni API hívás

                const params = roomId ? {} : { userId: validUserId }; // Egyéni esetben felhasználó azonosító kell

                const response = await axios.get(endpoint, { params });
                console.log("API válasza:", response.data);
                setLikedPrograms(response.data);
            } catch (err) {
                console.error("❌ Hiba történt a kedvelt programok lekérésekor:", err);
                setError("Nem sikerült betölteni a kedvelt programokat.");
            }
        };

        fetchLikedPrograms();
    }, [apiUrl, validUserId, roomId]);

    const resetLikedPrograms = async () => {
        try {
            const endpoint = roomId
                ? `${apiUrl}/api/room/${roomId}/liked-programs/reset` // Szoba törlése
                : `${apiUrl}/programs/liked/reset`; // Egyéni törlés

            const data = roomId ? {} : { userId: validUserId }; // Egyéni esetben userId kell

            await axios.delete(endpoint, { data });
            setLikedPrograms([]);
            console.log("✅ Kedvelt programok törölve.");
        } catch (err) {
            console.error("❌ Hiba történt a kedvelt programok törlésekor:", err);
            setError("Nem sikerült törölni a kedvelt programokat.");
        }
    };

    return (
        <div className="liked-programs-container">
            <h2 className="liked-title">
                💙 Kedvelt programok {roomId ? `(Szoba: ${roomId})` : "(Saját)"}
            </h2>

            {error && <div className="error-message">{error}</div>}
            {likedPrograms.length === 0 && <div className="no-liked">Nincs kedvelt program.</div>}

            <div className="program-grid">
                {likedPrograms.map((program) => (
                    <div key={program.ProgramID} className="program-card">
                        <img src={`http://localhost:3001/images/${program.Image}`} alt={program.Name} className="program-image" />
                        <h3>{program.Name}</h3>
                        <p>{program.Description}</p>
                        <p>🌍 Város: {program.CityName}</p>
                        <p>📍 Helyszín: {program.Location}</p>

                        <p>⏳ Időtartam: {magyarIdotartam[
                                         program.Duration === 1 ? "half_day" :
                                         program.Duration === 2 ? "whole_day" :
                                         program.Duration === 3 ? "weekend" :
                                         program.Duration
                                        ] || "Ismeretlen időtartam"}</p>
                        <p>💰 Költség: {program.Cost === "paid" ? "Fizetős" : "Ingyenes"}</p>
                        <p>👍 Kedvelések száma: <strong>{program.LikesCount}</strong></p>
                        <a href={program.MoreInfoLink} target="" rel="">
                            <button>További információk</button>
                        </a>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button onClick={() => navigate("/")} className="back-button">
                    ⬅️ Vissza a főoldalra
                </button>
                <button onClick={resetLikedPrograms} className="reset-button">
                    🔄 Összes kedvelt program törlése
                </button>
                
                {/* 📊 Az összegzés gomb csak akkor jelenik meg, ha a felhasználó szobában van */}
                {roomId && (
                    <button onClick={() => navigate("/summary")} className="summary-button">
                        📊 Összegzés megtekintése
                    </button>
                )}
            </div>


            {/* 🔥 LuckyWheel csak akkor jelenik meg, ha vannak programok */}
            {likedPrograms.length > 0 ? (
                <LuckyWheel apiUrl={apiUrl} userId={validUserId} />
            ) : (
                <p className="no-programs-message">⚠️ Lájkold a programokat, hogy pörgethess! 😊</p>
            )}
        </div>
    );
}

export default LikedPrograms;
