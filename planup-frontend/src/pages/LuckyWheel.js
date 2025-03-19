import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/LuckyWheel.css";
import { Wheel } from "react-custom-roulette";

function LuckyWheel({ apiUrl, userId }) {
  const [programs, setPrograms] = useState([]);
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(null);
  const [showText, setShowText] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Define colors for the wheel segments
  const backgroundColors = [    
    // Piros árnyalatok
    "#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC", "#990000", "#CC0000", "#800000", "#8B0000", "#A52A2A", "#B22222", "#DC143C",
    
    // Narancs árnyalatok
    "#FFA500", "#FFCC66", "#FF9933", "#FF8000", "#CC6600", "#FF4500", "#FF7F50", "#FF6347", "#FF8C00", "#FFA07A", "#E9967A", "#F08080",
    
    // Sárga árnyalatok
    "#FFFF00", "#FFFF66", "#FFFF99", "#FFFFCC", "#CCCC00", "#999900", "#FFD700", "#FAFAD2", "#FFEFD5", "#FFE4B5", "#FFDAB9", "#EEE8AA",
    
    // Zöld árnyalatok
    "#00FF00", "#66FF66", "#99FF99", "#CCFFCC", "#009900", "#00CC00", "#33CC33", "#006400", "#008000", "#228B22", "#32CD32", "#90EE90",
    "#98FB98", "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#008080", "#20B2AA", "#66CDAA",
    
    // Türkiz árnyalatok
    "#00FFFF", "#66FFFF", "#99FFFF", "#CCFFFF", "#009999", "#00CCCC", "#40E0D0", "#48D1CC", "#AFEEEE", "#7FFFD4", "#B0E0E6", "#5F9EA0",
    
    // Kék árnyalatok
    "#0000FF", "#3333FF", "#6666FF", "#9999FF", "#CCCCFF", "#000099", "#0000CC", "#000080", "#00008B", "#0000CD", "#4169E1", "#1E90FF",
    "#00BFFF", "#87CEEB", "#87CEFA", "#4682B4", "#6495ED", "#7B68EE", "#6A5ACD", "#483D8B",
    
    // Lila árnyalatok
    "#9900CC", "#CC00FF", "#CC66FF", "#CC99FF", "#CCCCFF", "#9933CC", "#6600CC", "#800080", "#8B008B", "#9400D3", "#9932CC", "#BA55D3",
    "#DA70D6", "#EE82EE", "#DDA0DD", "#D8BFD8", "#E6E6FA", "#8A2BE2", "#9370DB", "#6A5ACD",
    
    // Rózsaszín árnyalatok
    "#FF00FF", "#FF66FF", "#FF99FF", "#FFCCFF", "#CC00CC", "#990099", "#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#DB7093", "#C71585",
    
    // Barna árnyalatok
    "#996633", "#CC9966", "#FFCC99", "#663300", "#996600", "#A0522D", "#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460", "#D2B48C",
    
    // Szürke árnyalatok
    "#666666", "#999999", "#CCCCCC", "#DDDDDD", "#333333", "#808080", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#DCDCDC", "#F5F5F5", "#F8F8FF",
    
    // Egyéb különleges színek
    "#2F4F4F", "#556B2F", "#BDB76B", "#191970", "#708090", "#778899", "#BC8F8F", "#F0E68C", "#E0FFFF", "#FAEBD7", "#FAF0E6", "#FDF5E6",
    "#FFDEAD", "#F5DEB3", "#FFE4C4", "#FFDEAD", "#F0FFF0", "#FFFAF0", "#F5FFFA", "#708090", "#CD5C5C", "#4B0082", "#FFFACD", "#FFF8DC"
  ];
  
  
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
    setShowText(false);

    console.log(`🎰 Pörgetés... A nyertes indexe: ${randomIndex}`);

    setTimeout(() => {
      setWinner(programs[randomIndex].option);
    }, 3500); // Show winner after spin

    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true); // Disable further spins after the first spin
      console.log(`🎉 Pörgetés vége! Nyertes: ${programs[randomIndex].option}`);
    }, 3500);
  };

  return (
    <div className="lucky-wheel-container">
      <h2 className="lucky-wheel-header">🎡 Szerencsekerék</h2>
      {programs.length > 0 ? (
        <>
          {winner && <p className="winner-text">🎉 A nyertes program: {winner}!</p>}
          <div className="wheel-overlay-container">
            <Wheel 
              mustStartSpinning={spinning} 
              prizeNumber={prizeIndex ?? 0}
              data={programs.map(program => ({ option: showText ? program.option : "" }))}
              backgroundColors={backgroundColors}
              onStopSpinning={() => {
                setSpinning(false); // Ensure spinning stops
              }}
            />
            <div className="wheel-overlay"></div>
          </div>
          <button className="spin-button" onClick={handleSpin} disabled={spinning}>
            {spinning ? "Pörgetés..." : hasSpun ? "Pörgess újra!" : "Pörgesd meg!"}
          </button>
        </>
      ) : (
        <p>⚠️ Nincsenek kedvelt programok! Lájkold a programokat, hogy pörgethess! 😊</p>
      )}
    </div>
  );
}

export default LuckyWheel;