import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel
} from '@mui/material';

const API_BASE = 'http://localhost:3001/api/admin';
const UPLOAD_URL = 'http://localhost:3001/api/upload';
const IMAGE_BASE = 'http://localhost:3001/images';

const magyarIdotartam = {
  half_day: "Fél napos",
  whole_day: "Egész napos",
  weekend: "Egész hétvégés",
};

const AdminPanel = () => {
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', duration: '', cost: false, location: '', image: '', moreInfoLink: '', city: '' });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchPrograms();
    fetchUsers();
    fetchCities();
  }, []);

  const fetchPrograms = async () => {
    const res = await axios.get(`${API_BASE}/programs`);
    setPrograms(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`);
    setUsers(res.data);
  };

  const fetchCities = async () => {
    const res = await axios.get(`${API_BASE}/cities`);
    setCities(res.data);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await axios.post(UPLOAD_URL, formData);
    return res.data.filePath;
  };

  const saveProgram = async () => {
    const imagePath = await handleImageUpload();
    const finalForm = { ...form, image: imagePath || form.image };

    if (editingId) {
      await axios.put(`${API_BASE}/programs/${editingId}`, finalForm);
    } else {
      await axios.post(`${API_BASE}/add-program`, finalForm);
    }
    setForm({ name: '', description: '', duration: '', cost: false, location: '', image: '', moreInfoLink: '', city: '' });
    setEditingId(null);
    setImageFile(null);
    fetchPrograms();
  };

  const editProgram = (program) => {
    setForm({
      ...program,
      duration: program.Duration,
      cost: program.Cost,
      city: program.CityName
    });
    setEditingId(program.ProgramID);
  };

  const deleteProgram = async (id) => {
    await axios.delete(`${API_BASE}/programs/${id}`);
    fetchPrograms();
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('❌ Hiba a felhasználó törlésekor:', err.response?.data || err.message);
      alert('Törlés nem sikerült: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Box sx={{ p: 4, fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Admin Panel</Typography>

      {/* PROGRAMOK */}
      <Box sx={{ mb: 5, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6">Program hozzáadása / szerkesztése</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', mb: 2 }}>
          <TextField name="name" label="Név" value={form.name} onChange={handleInput} />
          <TextField name="description" label="Leírás" value={form.description} onChange={handleInput} />
          <Select name="duration" value={form.duration} onChange={handleInput} displayEmpty>
            <MenuItem value="">Válassz időtartamot</MenuItem>
            <MenuItem value={1}>{magyarIdotartam.half_day}</MenuItem>
            <MenuItem value={2}>{magyarIdotartam.whole_day}</MenuItem>
            <MenuItem value={3}>{magyarIdotartam.weekend}</MenuItem>
          </Select>
          <Select name="cost" value={form.cost} onChange={handleInput} displayEmpty>
            <MenuItem value={false}>Ingyenes</MenuItem>
            <MenuItem value={true}>Fizetős</MenuItem>
          </Select>
          <TextField name="location" label="Helyszín" value={form.location} onChange={handleInput} />
          <Button variant="outlined" component="label">Kép tallózása
            <input type="file" hidden accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          </Button>
          <TextField name="moreInfoLink" label="További információ" value={form.moreInfoLink} onChange={handleInput} />
          <Select name="city" value={form.city} onChange={handleInput} displayEmpty>
            <MenuItem value="">Válassz várost</MenuItem>
            {cities.map((city, i) => <MenuItem key={i} value={city}>{city}</MenuItem>)}
          </Select>
        </Box>
        <Button variant="contained" onClick={saveProgram}>{editingId ? 'Mentés' : 'Hozzáadás'}</Button>
      </Box>

      {/* PROGRAM TÁBLÁZAT */}
      <Typography variant="h6">Programok listája</Typography>
      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell>Leírás</TableCell>
              <TableCell>Kép</TableCell>
              <TableCell>Város</TableCell>
              <TableCell>Időtartam</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((p) => (
              <TableRow key={p.ProgramID}>
                <TableCell>{p.Name}</TableCell>
                <TableCell>{p.Description}</TableCell>
                <TableCell>
                  {p.Image && <img src={`${IMAGE_BASE}/${p.Image.replace('/images/', '')}`} alt="" width={80} />}
                </TableCell>
                <TableCell>{p.CityName || ''}</TableCell>
                <TableCell>{
                  magyarIdotartam[
                    p.Duration === 1
                      ? "half_day"
                      : p.Duration === 2
                      ? "whole_day"
                      : p.Duration === 3
                      ? "weekend"
                      : p.Duration
                  ] || "Ismeretlen időtartam"
                }</TableCell>
                <TableCell>
                  <Button onClick={() => editProgram(p)}>Szerkeszt</Button>
                  <Button onClick={() => deleteProgram(p.ProgramID)} color="error">Törlés</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FELHASZNÁLÓK */}
      <Typography variant="h6">Felhasználók</Typography>
      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Művelet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.UserID}>
                <TableCell>{u.Name || u.Username}</TableCell>
                <TableCell>{u.Email}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteUser(u.UserID)} color="error">Törlés</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPanel;