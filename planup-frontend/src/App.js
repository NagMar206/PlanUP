import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Programs from './pages/Programs';
import ProgramSwipe from './pages/ProgramSwipe';
import Rooms from './pages/Rooms';
import Profile from './pages/Profile';
import Navbar from './pages/Navbar';


function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Registration />} />
<Route path="/programs" element={<Programs />} />
<Route path="/rooms" element={<Rooms apiUrl="http://localhost:3001" userId={1} />} />
<Route path="/profile" element={<Profile />} />
<Route path="/swipe" element={<ProgramSwipe apiUrl="http://localhost:3001" userId={1} />} />
</Routes>
</Router>
  );
}


export default App;
