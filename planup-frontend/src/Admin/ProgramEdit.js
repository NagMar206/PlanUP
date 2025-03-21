import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProgramEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState({
    Name: '',
    Description: '',
    Duration: '',
    Cost: '',
    Location: '',
    Image: '',
    MoreInfoLink: '',
  });

  // Program adatok lekérése az API-ból
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/admin/programs/${id}`)
      .then((response) => setProgram(response.data))
      .catch((error) =>
        console.error('Hiba történt a program adatainak lekérésekor:', error)
      );
  }, [id]);

  // Program frissítése az API-ban
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/admin/programs/${id}`, program);
      alert('✅ Program sikeresen frissítve!');
      navigate('/admin/list');
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
      <h1>Program módosítása</h1>
      <form>
        <label>Név:</label>
        <input type="text" name="Name" value={program.Name} onChange={handleChange} />
        <label>Leírás:</label>
        <textarea name="Description" value={program.Description} onChange={handleChange} />
        {/* További mezők */}
        <button type="button" onClick={handleUpdate}>
          Mentés
        </button>
      </form>
    </div>
  );
};

export default ProgramEdit;
