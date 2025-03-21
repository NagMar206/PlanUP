import React from 'react';
import ProgramList from './ProgramList';
import axios from 'axios';

const ProgramDelete = () => {
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/admin/programs/${id}`);
      alert(response.data.message || '✅ Program sikeresen törölve!');
      setPrograms(programs.filter((program) => program.ProgramID !== id)); // Frissítjük a listát
    } catch (error) {
      console.error('Hiba történt a program törlésekor:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`❌ ${error.response.data.error}`);
      } else {
        alert('❌ Hiba történt a program törlésekor.');
      }
    }
  };

  return (
    <ProgramList showButtons={true} onDelete={handleDelete} />
  );
};

export default ProgramDelete;
