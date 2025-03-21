import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/ProgramList.css'; // CSS fájl importálása a stílusokhoz

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Programok lekérése az API-ból
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/admin/programs')
      .then((response) => {
        setPrograms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Hiba történt:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/programs/${id}`);
      alert('✅ Program sikeresen törölve!');
      setPrograms((prevPrograms) =>
        prevPrograms.filter((program) => program.ProgramID !== id)
      );
    } catch (error) {
      console.error('Hiba történt a program törlésekor:', error);
      alert('❌ Hiba történt a program törlésekor.');
    }
  };

  if (loading) {
    return <p className="loading">Betöltés...</p>;
  }

  if (programs.length === 0) {
    return <p className="empty">Nincs elérhető program.</p>;
  }

  return (
    <div className="program-list-container">
      <h1 className="title">Programok listája</h1>
      <div className="program-grid">
        {programs.map((program) => (
          <div key={program.ProgramID} className="program-card">
            <img
              src={program.Image}
              alt={program.Name}
              className="program-image"
            />
            <h2 className="program-name">{program.Name}</h2>
            <p className="program-description">{program.Description}</p>
            <p><strong>Időtartam:</strong> {program.Duration}</p>
            <p><strong>Helyszín:</strong> {program.Location}</p>
            <p><strong>Költség:</strong> {program.Cost ? 'Van' : 'Nincs'}</p>
            <a href={program.MoreInfoLink} target="_blank" rel="noopener noreferrer">
              További információ
            </a>
            <button
              onClick={() => handleDelete(program.ProgramID)}
              className="delete-button"
            >
              Törlés
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
