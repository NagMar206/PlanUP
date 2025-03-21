import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramEdit = ({ match }) => {
  const [program, setProgram] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin/programs/${match.params.id}`)
      .then(response => setProgram(response.data))
      .catch(error => console.error('Hiba történt:', error));
  }, [match.params.id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/admin/programs/${match.params.id}`, program);
      alert('✅ Program sikeresen frissítve!');
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('❌ Hiba történt a program frissítésekor.');
    }
  };

  const handleChange = (e) => {
    setProgram({ ...program, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Program szerkesztése</h2>
      <form>
        <label>Név:
          <input type="text" name="name" value={program.name} onChange={handleChange} />
        </label><br />

        {/* További mezők... */}

        <button type="button" onClick={handleUpdate}>Mentés</button>
      </form>
    </div>
  );
};

export default ProgramEdit;
