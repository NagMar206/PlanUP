import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem } from '@mui/material';

const API_BASE = 'http://localhost:3001/api/admin';

const EditProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE}/programs/${id}`, { withCredentials: true })
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const saveChanges = () => {
    axios.put(`${API_BASE}/programs/${id}`, form, { withCredentials: true })
      .then(() => navigate('/admin'))
      .catch(err => console.error(err));
  };

  const deleteProgram = () => {
    axios.delete(`${API_BASE}/programs/${id}`, { withCredentials: true })
      .then(() => navigate('/admin'))
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Program szerkesztése</Typography>
      <TextField name="Name" label="Név" value={form.Name || ''} onChange={handleInput} fullWidth margin="normal" />
      <TextField name="Description" label="Leírás" value={form.Description || ''} onChange={handleInput} fullWidth margin="normal" />
      <Select name="Duration" value={form.Duration || ''} onChange={handleInput} fullWidth margin="normal">
        <MenuItem value={1}>Fél napos</MenuItem>
        <MenuItem value={2}>Egész napos</MenuItem>
        <MenuItem value={3}>Egész hétvégés</MenuItem>
      </Select>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={saveChanges}>Mentés</Button>
        <Button variant="outlined" color="error" onClick={deleteProgram} sx={{ ml: 2 }}>Törlés</Button>
      </Box>
    </Box>
  );
};

export default EditProgram;
