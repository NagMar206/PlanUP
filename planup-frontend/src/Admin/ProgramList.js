import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // Betöltési állapot

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/admin/programs') // Backend API hívás
      .then((response) => {
        setPrograms(response.data); // Adatok beállítása
        setLoading(false); // Betöltés vége
      })
      .catch((error) => {
        console.error('Hiba történt a programok lekérésekor:', error);
        setLoading(false); // Betöltés vége hibával
      });
  }, []);

  if (loading) {
    return <p>Betöltés...</p>; // Betöltési állapot megjelenítése
  }

  if (programs.length === 0) {
    return <p>Nincs elérhető program.</p>; // Üres lista esetén
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Programok listája</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {programs.map((program) => (
          <li key={program.ProgramID}>
            <strong>{program.Name}</strong> - {program.Description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
