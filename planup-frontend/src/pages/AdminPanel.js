import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    location: '',
    image: '',
    moreInfoLink: '',
  });

  const handleAddProgram = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/add-program', newProgram, { withCredentials: true });
      setNewProgram({
        name: '',
        description: '',
        price: '',
        cost: '',
        location: '',
        image: '',
        moreInfoLink: '',
      });
    } catch (error) {
      console.error('Hiba történt a program hozzáadásakor:', error);
    }
  };

  return (
    <div>
      {/* ... más funkciók ... */}

      <h3>Új program hozzáadása:</h3>
      <form>
        <label>
          Név:
          <input type="text" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} />
        </label>
        <br />
        <label>
          Leírás:
          <textarea value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} />
        </label>
        <br />
        <label>
          Ár:
          <input type="number" value={newProgram.price} onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })} />
        </label>
        <br />
        <label>
          Közvetlen költség:
          <input type="checkbox" checked={newProgram.cost === 'true'} onChange={(e) => setNewProgram({ ...newProgram, cost: e.target.checked ? 'true' : 'false' })} />
        </label>
        <br />
        <label>
          Helyszín:
          <input type="text" value={newProgram.location} onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value })} />
        </label>
        <br />
        <label>
          Kép URL:
          <input type="text" value={newProgram.image} onChange={(e) => setNewProgram({ ...newProgram, image: e.target.value })} />
        </label>
        <br />
        <label>
          További információk link:
          <input type="text" value={newProgram.moreInfoLink} onChange={(e) => setNewProgram({ ...newProgram, moreInfoLink: e.target.value })} />
        </label>
        <br />
        <button type="button" onClick={handleAddProgram}>Hozzáadás</button>
      </form>
    </div>
  );
};

export default AdminPanel;
