import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Admin.css'; // Közös CSS fájl importálása
import { useNavigate } from 'react-router-dom';

const magyarIdotartam = {
  1: "Fél napos",
  2: "Egész napos",
  3: "Egész hétvégés",
};

const magyarKoltseg = {
  free: "Ingyenes",
  paid: "Fizetős",
};

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Programok lekérése
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/admin/programs') // API hívás
      .then((response) => {
        setPrograms(response.data); // Adatok beállítása
        setLoading(false);
      })
      .catch((error) => {
        console.error('Hiba történt:', error);
        setLoading(false);
      });
  }, []);

  // Program törlése
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/programs/${id}`);
      alert('✅ Program sikeresen törölve!');
      setPrograms(programs.filter((program) => program.ProgramID !== id)); // Frissítjük a listát
    } catch (error) {
      console.error('Hiba történt a program törlésekor:', error);
      alert('❌ Hiba történt a program törlésekor.');
    }
  };

  // Navigáció a módosítási oldalra
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading) {
    return <p className="loading">Betöltés...</p>;
  }

  if (programs.length === 0) {
    return <p className="empty">Nincs elérhető program.</p>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Programok listája</h1>
      <div className="program-grid">
        {programs.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img
              src={`http://localhost:3001/images/${program.Image}`}
              alt={program.Name}
              className="program-image"
            />
            <h2 className="program-name">{program.Name}</h2>
            <p className="program-description">{program.Description}</p>
            <p><strong>Időtartam:</strong> {magyarIdotartam[program.Duration] || "Ismeretlen időtartam"}</p>
            <p><strong>Költség:</strong> {magyarKoltseg[program.Cost] || "Ismeretlen költség"}</p>
            <p><strong>Helyszín:</strong> {program.Location}</p>
            <a href={program.MoreInfoLink} target="_blank" rel="noopener noreferrer">
              További információ
            </a>
            <div className="button-group">
              <button
                onClick={() => handleEdit(program.ProgramID)}
                className="edit-button"
              >
                Módosítás
              </button>
              <button
                onClick={() => handleDelete(program.ProgramID)}
                className="delete-button"
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
