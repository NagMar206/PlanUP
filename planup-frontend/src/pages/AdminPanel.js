// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/users', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Hiba a felhasználók lekérésekor:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/add-user', newUser, { withCredentials: true });
      setUsers([...users, newUser]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error('Hiba történt a felhasználó hozzáadásakor:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/delete-user/${id}`, { withCredentials: true });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Hiba történt a felhasználó törlésekor:', error);
    }
  };

  return (
    <div>
      <h2>Admin Felület</h2>
      <h3>Felhasználók listája:</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => handleDeleteUser(user.id)}>Törlés</button>
          </li>
        ))}
      </ul>

      <h3>Új felhasználó hozzáadása:</h3>
      <form>
        <label>
          Név:
          <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        </label>
        <br />
        <label>
          E-mail:
          <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        </label>
        <br />
        <button type="button" onClick={handleAddUser}>Hozzáadás</button>
      </form>
    </div>
  );
};

export default AdminPanel;
