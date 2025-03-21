import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>
      <p>Válassz az alábbi adminisztrációs lehetőségek közül:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <Link to="/admin/create">Program létrehozása</Link>
        </li>
        <li>
          <Link to="/admin/list">Programok listázása</Link>
        </li>
        <li>
          <Link to="/admin/edit/:id">Program szerkesztése</Link> {/* Példa: ID-t dinamikusan kell megadni */}
        </li>
        <li>
          <Link to="/admin/delete/:id">Program törlése</Link> {/* Példa: ID-t dinamikusan kell megadni */}
        </li>
      </ul>
    </div>
  );
};

export default AdminPanel;
