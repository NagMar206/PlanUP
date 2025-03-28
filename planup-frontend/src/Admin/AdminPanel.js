import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";

const API_BASE = "http://localhost:3001/api/admin";
const UPLOAD_URL = "http://localhost:3001/api/upload";
const IMAGE_BASE = "http://localhost:3001/images";

const magyarIdotartam = {
  1: "Fél napos",
  2: "Egész napos",
  3: "Egész hétvégés",
};

const AdminPanel = () => {
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    cost: false,
    location: "",
    image: "",
    moreInfoLink: "",
    city: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/auth/status', { withCredentials: true })
      .then(res => {
        if (res.data.isAdmin) {
          setAuthorized(true);
        } else {
          alert('Nincs jogosultságod az admin felülethez!');
          window.location.href = '/';
        }
      })
      .catch(() => {
        alert('Nem vagy bejelentkezve!');
        window.location.href = '/';
      })
      .finally(() => setLoading(false));

    fetchPrograms();
    fetchUsers();
    fetchCities();
    fetchRooms();
  }, []);

  const fetchPrograms = async () => {
    const res = await axios.get(`${API_BASE}/programs`, {
      withCredentials: true,
    });
    setPrograms(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`, { withCredentials: true });
    setUsers(res.data);
  };

  const fetchCities = async () => {
    const res = await axios.get(`${API_BASE}/cities`, {
      withCredentials: true,
    });
    setCities(res.data);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await axios.post(UPLOAD_URL, formData, {
      withCredentials: true,
    });
    return res.data.filePath;
  };

  const saveProgram = async () => {
    const imagePath = await handleImageUpload();
    const finalForm = { ...form, image: imagePath || form.image };
    await axios.post(`${API_BASE}/add-program`, finalForm, {
      withCredentials: true,
    });
    setForm({
      name: "",
      description: "",
      duration: "",
      cost: false,
      location: "",
      image: "",
      moreInfoLink: "",
      city: "",
    });
    setImageFile(null);
    setImageFileName("");
    fetchPrograms();
  };

  const deleteProgram = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a programot?")) {
      await axios.delete(`${API_BASE}/programs/${id}`, {
        withCredentials: true,
      });
      fetchPrograms();
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a felhasználót?")) {
      await axios.delete(`${API_BASE}/users/${id}`, { withCredentials: true });
      fetchUsers();
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/admin/rooms", { withCredentials: true });
      setRooms(res.data);
    } catch (error) {
      console.error("Hiba történt a szobák lekérésekor:", error);
    }
  };

  const deleteRoom = async (roomId) => {
    if (window.confirm("Biztosan törlöd ezt a szobát?")) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/rooms/${roomId}`, {
          withCredentials: true
        });
        fetchRooms();
      } catch (error) {
        console.error("Hiba történt a szoba törlésekor:", error);
      }
    }
  };
  
  

  if (loading) return <Typography>Loading...</Typography>;
  if (!authorized)
    return (
      <Typography sx={{ color: "red", fontWeight: "bold", mt: 4 }}>
        ⚠️ 403: Admin access denied. Insufficient user privileges.
      </Typography>
    );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Admin Panel
      </Typography>

      {/* Program hozzáadás/szerkesztés */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 2,
          mb: 5,
        }}
      >
        <Typography variant="h6">Program hozzáadása / szerkesztése</Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            mb: 2,
          }}
        >
          <TextField
            name="name"
            label="Név"
            value={form.name}
            onChange={handleInput}
          />
          <TextField
            name="description"
            label="Leírás"
            value={form.description}
            onChange={handleInput}
          />
          <Select
            value={form.duration}
            name="duration"
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Válasszon időtartamot
            </MenuItem>
            {Object.entries(magyarIdotartam).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <Select name="cost" value={form.cost} onChange={handleInput}>
            <MenuItem value={false}>Ingyenes</MenuItem>
            <MenuItem value={true}>Fizetős</MenuItem>
          </Select>
          <TextField
            name="location"
            label="Helyszín"
            value={form.location}
            onChange={handleInput}
          />
          <Button variant="outlined" component="label">
            Kép tallózása
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setImageFileName(file ? file.name : "");
              }}
            />
          </Button>
          {imageFileName && (
            <Typography variant="body2" color="primary" sx={{ mt: -1 }}>
              Tallózott fájl neve: {imageFileName}
            </Typography>
          )}
          <TextField
            name="moreInfoLink"
            label="További információ"
            value={form.moreInfoLink}
            onChange={handleInput}
          />
          <Select
            value={form.city}
            name="city"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Válasszon várost
            </MenuItem>
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Button variant="contained" onClick={saveProgram}>
          {"Hozzáadás"}
        </Button>
      </Box>

      {/* Programok listája */}
      <Typography variant="h6">Programok listája</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell>Leírás</TableCell>
              <TableCell>Kép</TableCell>
              <TableCell>Város</TableCell>
              <TableCell>Időtartam</TableCell>
              <TableCell>Művelet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((p) => (
              <TableRow key={p.ProgramID}>
                <TableCell>{p.Name}</TableCell>
                <TableCell>{p.Description}</TableCell>
                <TableCell>
                  {p.Image && (
                    <img src={`${IMAGE_BASE}/${p.Image}`} width={80} alt="" />
                  )}
                </TableCell>
                <TableCell>{p.CityName}</TableCell>
                <TableCell>{magyarIdotartam[p.Duration]}</TableCell>
                <TableCell>
                  <IconButton color="error" size="large" onClick={() => deleteProgram(p.ProgramID)}>
                    <DeleteIcon fontSize="inherit" /> {/*✅ Ez lesz a helyes!*/}
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Felhasználók listája */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Felhasználók
      </Typography>
      <TableContainer component={Paper}>
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
                <IconButton color="error" size="large" onClick={() => deleteRoom(room.RoomID)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        {/* Szobák listája */}
<Typography variant="h6" sx={{ mt: 4 }}>
  Szobák
</Typography>
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Szoba ID</TableCell>
        <TableCell>Szoba Kód</TableCell>
        <TableCell>Felhasználók</TableCell>
        <TableCell>Művelet</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {rooms?.map((room) => (
  <TableRow key={room.RoomID}>
    <TableCell>{room.RoomID}</TableCell>
    <TableCell>{room.RoomCode}</TableCell>
    <TableCell>
    {room.Users?.map((user) => user.Username).join(", ") || "Nincs felhasználó"}
    </TableCell>
    <TableCell>
      <IconButton color="error" size="large" onClick={() => deleteRoom(room.RoomID, room.Users)}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
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
