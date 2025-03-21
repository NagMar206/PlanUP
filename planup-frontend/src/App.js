// 📌 Szükséges importok
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// 📌 Oldalak importálása
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Programs from './pages/Programs';
import ProgramSwipe from './pages/ProgramSwipe';
import Rooms from './pages/Rooms';
import Profile from './pages/Profile';
import Navbar from './pages/Navbar';
import LikedPrograms from './pages/LikedPrograms'; // Kedvelt programok oldal
import Footer from './pages/Footer';
import LuckyWheel from './pages/LuckyWheel';
import Summary from "./pages/Summary";

// 📌 Admin oldalak importálása
import AdminPanel from './Admin/AdminPanel'; // Admin főoldal
import ProgramCreate from './Admin/ProgramCreate'; // Program létrehozás
import ProgramEdit from './Admin/ProgramEdit'; // Program szerkesztés
import ProgramDelete from './Admin/ProgramDelete'; // Program törlés
import ProgramList from './Admin/ProgramList'; // Program lista megtekintése
import ProgramShow from './Admin/ProgramShow'; // Egyedi program részletei

// 📌 Context importálása
import { RoomProvider } from "./context/RoomContext";

// 📌 API URL beállítása (globális változó)
const apiUrl = "http://localhost:3001";

function App() {
  // 📌 Felhasználó állapot kezelése
  const [user, setUser] = useState(null);

  // 📌 Felhasználói státusz lekérdezése az API-ból
  useEffect(() => {
    axios.get(`${apiUrl}/api/auth/status`, { withCredentials: true })
      .then(response => {
        if (response.data.loggedIn) {
          setUser(response.data.userId); // Ha be van jelentkezve, állítsuk be a felhasználót
        } else {
          setUser(null); // Ha nincs bejelentkezve, állítsuk null-ra
        }
      })
      .catch(() => setUser(null)); // Hibakezelés esetén is null legyen az állapot
  }, []);

  return (
    <RoomProvider> {/* 📌 RoomProvider csomagolás */}
      <Router>
        {/* 📌 Navigációs sáv */}
        <Navbar user={user} />

        {/* 📌 Útvonalak definiálása */}
        <Routes>
          {/* Főoldal és alapvető oldalak */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/rooms" element={<Rooms apiUrl={apiUrl} userId={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/swipe" element={<ProgramSwipe apiUrl={apiUrl} userId={user} />} />
          <Route path="/liked-programs" element={<LikedPrograms apiUrl={apiUrl} userId={user} />} />
          <Route path="/summary" element={<Summary apiUrl={apiUrl} />} />
          <Route path="/lucky-wheel" element={<LuckyWheel apiUrl={apiUrl} userId={user} />} />

           {/* Admin oldalak */}
  <Route path="/admin" element={<AdminPanel />} /> {/* Admin főoldal */}
  <Route path="/admin/create" element={<ProgramCreate apiUrl={apiUrl} />} /> {/* Program létrehozás */}
  <Route path="/admin/edit/:id" element={<ProgramEdit apiUrl={apiUrl} />} /> {/* Program szerkesztés */}
  <Route path="/admin/delete/:id" element={<ProgramDelete apiUrl={apiUrl} />} /> {/* Program törlés */}
  <Route path="/admin/list" element={<ProgramList apiUrl={apiUrl} />} /> {/* Program lista */}
  <Route path="/admin/show/:id" element={<ProgramShow apiUrl={apiUrl} />} /> {/* Egyedi program megtekintése */}
</Routes>

        {/* 📌 Lábjegyzet */}
        <Footer />
      </Router>
    </RoomProvider>
  );
}

export default App;
