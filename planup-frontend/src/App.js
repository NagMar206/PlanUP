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
import axios from 'axios';



const apiUrl = "http://localhost:3001"; 


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/auth/status", { withCredentials: true })
      .then(response => {
        if (response.data.loggedIn) {
          setUser(response.data.userId);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />        
        <Route path="/register" element={<Registration />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/rooms" element={<Rooms apiUrl="http://localhost:3001" userId={1} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/swipe" element={<ProgramSwipe apiUrl="http://localhost:3001" userId={1} />} />
        <Route path="/liked-programs" element={<LikedPrograms apiUrl="http://localhost:3001" userId={1} />} /> 
        <Route path="/lucky-wheel" element={<LuckyWheel apiUrl={apiUrl} userId={1} />} />


      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
