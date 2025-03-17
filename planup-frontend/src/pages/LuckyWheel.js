import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/LuckyWheel.css";
import { Wheel } from "react-custom-roulette";

function LuckyWheel({ apiUrl, userId }) {
  const [programs, setPrograms] = useState([]);
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(null);

  useEffect(() => {
    if (!apiUrl || typeof apiUrl !== "string") {
      console.error("❌ HIBA: Az apiUrl nincs helyesen beállítva!", apiUrl);
      return;
    }

    console.log(`✅ API hívás: ${apiUrl}/programs/liked?userId=${userId}`);

    const fetchLikedPrograms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/programs/liked`, {
          params: { userId },
        });

        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ Nincsenek kedvelt programok!");
        }

        setPrograms(response.data.map(program => ({ option: program.Name })));
      } catch (err) {
        console.error("❌ Hiba történt a programok betöltésekor:", err);
      }
    };

    fetchLikedPrograms();
  }, [apiUrl, userId]);

  const handleSpin = () => {
    if (programs.length === 0 || spinning) return;

    const randomIndex = Math.floor(Math.random() * programs.length);
    setPrizeIndex(randomIndex);
    setWinner(null);
    setSpinning(true);

    console.log(`🎰 Pörgetés... A nyertes indexe: ${randomIndex}`);

    setTimeout(() => {
      setWinner(programs[randomIndex].option);
    }, 3000); // Nyertes kiírás késleltetése

    setTimeout(() => {
      setSpinning(false);
      console.log(`🎉 Pörgetés vége! Nyertes: ${programs[randomIndex].option}`);
    }, 3500); // Pörgetés befejezése
  };

  return (
    <div className="lucky-wheel-container">
      <h2 className="lucky-wheel-header">🎡 Szerencsekerék</h2>
      {programs.length > 0 ? (
        <>
          {winner && <p className="winner-text">🎉 A nyertes program: {winner}!</p>}
          <Wheel 
            mustStartSpinning={spinning} 
            prizeNumber={prizeIndex ?? 0}
            data={programs} 
            onStopSpinning={() => setSpinning(false)}
          />
          <button className="spin-button" onClick={handleSpin} disabled={spinning}>
            {spinning ? "Pörgetés..." : "Pörgesd meg!"}
          </button>
        </>
      ) : (
        <p>⚠️ Nincsenek kedvelt programok! Lájkold a programokat, hogy pörgethess! 😊</p>
      )}
    </div>
  );
}

export default LuckyWheel;
