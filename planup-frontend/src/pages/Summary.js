import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoom } from "../context/RoomContext"; // Szoba azonosító használata
import "../Style/Summary.css"; // Ha kell, külön CSS az oldalhoz

function Summary({ apiUrl }) {
    const { roomId } = useRoom(); // Szoba azonosító lekérése
    const [summary, setSummary] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!roomId) return; // Ha nincs szoba, ne csináljon semmit

        const fetchSummary = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/room/${roomId}/summary`);
                setSummary(response.data);
            } catch (err) {
                console.error("❌ Hiba az összegzés lekérésekor:", err);
                setError("Nem sikerült lekérni az összegzést.");
            }
        };

        fetchSummary();
    }, [roomId, apiUrl]);

    return (
        <div className="summary-container">
            <h2>📊 Összegzés {roomId ? `(Szoba: ${roomId})` : ""}</h2>

            {roomId ? (
                <>
                    {error && <div className="error-message">{error}</div>}
                    {summary.length > 0 ? (
                        <ul className="summary-list">
                            {summary.map((program) => (
                                <li key={program._id} className="summary-item">
                                    <h3>{program.name}</h3>
                                    <p>👍 {program.count} ember kedvelte</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nincs adat az összegzéshez.</p>
                    )}
                </>
            ) : (
                <p>Ez az oldal csak szobán belül érhető el.</p>
            )}
        </div>
    );
}

export default Summary;
