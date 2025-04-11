//  Szükséges importok
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import axios from "axios";

//  Oldalak importálása
import HomePage from "./components/HomePage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ProgramSwipe from "./pages/ProgramSwipe";
import Profile from "./pages/Profile";
import LikedPrograms from "./pages/LikedPrograms"; // Kedvelt programok oldal

//  Szobához kapcsolódó oldalak importálása
import Summary from "./Rooms/Summary";
import Rooms from "./Rooms/Rooms";
import RoomSwipe from "./Rooms/RoomSwipe";

//  Komponensek importálása
import Navbar from "./components/Navbar";

//  Admin oldalak importálása
import AdminPanel from "./Admin/AdminPanel"; // Admin főoldal

//  Context importálása
import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";

//  API URL beállítása (globális változó)
const apiUrl = "http://localhost:3001";

function App() {
  //  Felhasználó állapot kezelése
  const [user, setUser] = useState(null);

  //  Felhasználói státusz lekérdezése az API-ból
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/auth/status`, { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setUser(response.data.userId); // Ha be van jelentkezve, állítsuk be a felhasználót
        } else {
          setUser(null); // Ha nincs bejelentkezve, állítsuk null-ra
        }
      })
      .catch(() => setUser(null)); // Hibakezelés esetén is null legyen az állapot
  }, []);

  return (
    <SocketProvider>
      {" "}
      {/*  SocketProvider beépítése */}
      <RoomProvider>
        {" "}
        {/*  RoomProvider csomagolás */}
        <Router>
          {/*  Navigációs sáv */}
          <Navbar user={user} />

          {/*  Útvonalak definiálása */}
          <Routes>
            {/* Főoldal és alapvető oldalak */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/rooms"
              element={<Rooms apiUrl={apiUrl} userId={user} />}
            />
            <Route
              path="/profile"
              element={<Profile user={user} setUser={setUser} />}
            />
            <Route
              path="/swipe"
              element={<ProgramSwipe apiUrl={apiUrl} userId={user} />}
            />
            <Route
              path="/liked-programs"
              element={<LikedPrograms apiUrl={apiUrl} userId={user} />}
            />
            <Route path="/summary" element={<Summary apiUrl={apiUrl} />} />
            <Route
              path="/roomswipe/:roomCode"
              element={<RoomSwipe apiUrl={apiUrl} />}
            />
            {/* Admin oldalak */}
            <Route path="/admin" element={<AdminPanel />} />{" "}
            {/* Admin főoldal */}
          </Routes>

          {/*  Lábjegyzet */}
        </Router>
      </RoomProvider>
    </SocketProvider>
  );
}

export default App;
