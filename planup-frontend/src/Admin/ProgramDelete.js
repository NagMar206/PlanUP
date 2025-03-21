import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams és useNavigate importálása
import axios from 'axios';

const ProgramDelete = () => {
  const { id } = useParams(); // Az URL-ből származó paraméterek elérése
  const navigate = useNavigate(); // Navigáció az oldal törlése után
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true); // Betöltési állapot

  // Program adatok lekérése az API-ból
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/admin/programs/${id}`)
      .then((response) => {
        setProgram(response.data);
        setLoading(false); // Betöltés vége
      })
      .catch((error) => {
        console.error('Hiba történt a program adatainak lekérésekor:', error);
        setLoading(false); // Betöltés vége hibával
      });
  }, [id]);

  // Program törlése
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/programs/${id}`);
      alert('✅ Program sikeresen törölve!');
      navigate('/admin/list'); // Visszairányítás a programok listájára
    } catch (error) {
      console.error('Hiba történt a program törlésekor:', error);
      alert('❌ Hiba történt a program törlésekor.');
    }
  };

  if (loading) {
    return <p>Betöltés...</p>; // Betöltési állapot megjelenítése
  }

  if (!program) {
    return <p>Nem található ilyen program.</p>; // Ha nincs program az adott ID-hoz
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Program törlése</h1>
      <p>Biztosan törölni szeretné a(z) <strong>{program.Name}</strong> programot?</p>
      <button onClick={handleDelete} style={{ marginRight: '10px', backgroundColor: 'red', color: 'white' }}>
        Törlés
      </button>
      <button onClick={() => navigate('/admin/list')} style={{ backgroundColor: 'gray', color: 'white' }}>
        Mégse
      </button>
    </div>
  );
};

export default ProgramDelete;
