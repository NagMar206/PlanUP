import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramShow = ({ match }) => {
  const [program, setProgram] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin/programs/${match.params.id}`)
      .then(response => setProgram(response.data))
      .catch(error => console.error('Hiba történt:', error));
  }, [match.params.id]);

  return (
    <div>
      <h2>Program részletei</h2>
      <p>Név: {program.name}</p>
      <p>Leírás: {program.description}</p>
      {/* További részletek... */}
    </div>
  );
};

export default ProgramShow;
