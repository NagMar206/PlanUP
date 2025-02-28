import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Programs() {
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPrograms = async () => {
          try {
              const response = await axios.get('http://localhost:3001/programs');
              setPrograms(response.data);
          } catch (err) {
              console.error('Axios Error:', err.response || err.message);
              setError('Nem sikerült betölteni a programokat.');
          }
      };
      fetchPrograms();
  }, []);
  

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Programok</h1>
            {programs.map((program) => (
                <div key={program.ProgramID}>
                    <h2>{program.Name}</h2>
                    <p>{program.Description}</p>
                    <p>Helyszín: {program.Location}</p>
                    <p>Időtartam: {program.Duration}</p>
                    <p>Költség: {program.Cost}</p>
                </div>
            ))}
        </div>
    );
}

export default Programs;
