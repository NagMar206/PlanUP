import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/programs')
      .then(response => setPrograms(response.data))
      .catch(error => console.error('Hiba történt:', error));
  }, []);

  return (
    <div>
      <h2>Programok listája</h2>
      <ul>
        {programs.map(program => (
          <li key={program.id}>{program.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
