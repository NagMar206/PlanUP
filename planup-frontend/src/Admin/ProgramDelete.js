import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramDelete = ({ match }) => {
  const [program, setProgram] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin/programs/${match.params.id}`)
      .then(response => setProgram(response.data))
      .catch(error => console.error('Hiba történt:', error));
  }, [match.params.id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/programs/${match.params.id}`);
      alert('✅ Program sikeresen törölve!');
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('❌ Hiba történt a program törlésekor.');
    }
  };

  return (
    <div>
      <h2>Program törlése</h2>
      <p>Biztosan törölni szeretné a(z) {program.name} programot?</p>
      <button type="button" onClick={handleDelete}>Törlés</button>
    </div>
  );
};

export default ProgramDelete;
