import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams importálása
import axios from 'axios';

const ProgramEdit = () => {
  const { id } = useParams(); // Az útvonalból származó paraméterek elérése
  const [program, setProgram] = useState({
    name: '',
    description: '',
    duration: '',
    cost: false,
    location: '',
    image: '',
    moreInfoLink: '',
  });

  // Program adatok lekérése az API-ból
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/admin/programs/${id}`)
      .then((response) => setProgram(response.data))
      .catch((error) => console.error('Hiba történt a program adatainak lekérésekor:', error));
  }, [id]);

  // Program frissítése az API-ban
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/admin/programs/${id}`, program);
      alert('✅ Program sikeresen frissítve!');
    } catch (error) {
      console.error('Hiba történt a program frissítésekor:', error);
      alert('❌ Hiba történt a program frissítésekor.');
    }
  };

  // Input mezők változásának kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram((prevProgram) => ({
      ...prevProgram,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Program szerkesztése</h1>
      <form>
        <div>
          <label>Név:</label>
          <input
            type="text"
            name="name"
            value={program.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Leírás:</label>
          <textarea
            name="description"
            value={program.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Időtartam:</label>
          <input
            type="text"
            name="duration"
            value={program.duration}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Költség:</label>
          <input
            type="checkbox"
            name="cost"
            checked={program.cost}
            onChange={(e) =>
              setProgram((prevProgram) => ({
                ...prevProgram,
                cost: e.target.checked,
              }))
            }
          />
        </div>
        <div>
          <label>Helyszín:</label>
          <input
            type="text"
            name="location"
            value={program.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Kép URL:</label>
          <input
            type="text"
            name="image"
            value={program.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>További információ link:</label>
          <input
            type="text"
            name="moreInfoLink"
            value={program.moreInfoLink}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Mentés
        </button>
      </form>
    </div>
  );
};

export default ProgramEdit;
