import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Programs from './pages/Programs';
import ProgramSwipe from './pages/ProgramSwipe';
import Rooms from './pages/Rooms';
import Profile from './pages/Profile';
import Navbar from './pages/Navbar';
import LikedPrograms from './pages/LikedPrograms'; // Új oldal importálása
import Footer from './pages/Footer';
import LuckyWheel from './pages/LuckyWheel';
import AdminPanel from './Admin/AdminPanel';
import axios from 'axios';
import { RoomProvider } from "./context/RoomContext";
import Summary from "./pages/Summary";

const apiUrl = "http://localhost:3001"; 


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/auth/status", { withCredentials: true })
      .then(response => {
        if (response.data.loggedIn) {
          setUser(response.data.userId);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <RoomProvider> {/* 📌 Itt csomagoljuk be a RoomProvider-t */}
        <Router>
            <Navbar user={user} />
            <Routes>
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
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
            <Footer />
        </Router>
    </RoomProvider>
);
}

export default App;
