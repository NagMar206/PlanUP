// Kötelező importok
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");

// Saját modulok
const db = require('./config/dbConfig');
const programRoutes = require('./routes/programs'); 
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const SESSION_SECRET = "125eef9d70e5e65deb3e877eca66f1d805463e8062390de14b33bdad0ba58b8a";

// Alkalmazás és szerver létrehozása
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// IO elérhető lesz a request objektumon keresztül
app.set('io', io);

// Szerver indítása
server.listen(3001, () => {
  console.log('✅ Szerver fut a 3001-es porton');
});

io.on("connection", (socket) => {
  console.log("🧩 Új socket kapcsolat:", socket.id);

  socket.on("joinRoom", (roomCode, userId) => {
    socket.join(roomCode);
    console.log(`👥 Felhasználó ${userId} belépett a(z) ${roomCode} szobába.`);
  });

  socket.on("startSwipe", ({ roomCode, filters }) => {
    console.log(`🚀 Host elindította a válogatást szobában: ${roomCode}`);
    socket.to(roomCode).emit("receiveStartSwipe", { filters });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket kapcsolat megszakadt:", socket.id);
  });
});


// Middleware-ek
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session kezelés
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// CORS beállítás
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Extra CORS fejlécek minden kéréshez
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// IO objektum hozzáadása a request-hez
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Statikus fájlok kiszolgálása (képek)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Multer konfiguráció (képfeltöltés kezelése)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/images'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Kép feltöltési útvonal
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nincs feltöltött kép!' });
  res.status(200).json({
    message: 'Kép sikeresen feltöltve!',
    filePath: `${req.file.filename}`
  });
});

// Adatbázis kapcsolat middleware
app.use(async (req, res, next) => {
  try {
    if (!db) {
      db = await mysql.createConnection(dbConfig);
      console.log('Adatbázis kapcsolat újra létrehozva.');
    }
    req.db = db;
    next();
  } catch (err) {
    console.error('Hiba az adatbázis újracsatlakozás során:', err.message);
    res.status(500).json({ error: 'Adatbázis kapcsolat sikertelen.' });
  }
});

// ROUTE-ok regisztrálása
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/profile', profileRoutes);
app.use('/programs', programRoutes);
app.use('/api/admin', adminRoutes);

// Egyedi útvonalak és funkciók (regisztráció, like, random program, összegzés stb.)

// RoomCode alapján RoomID lekérdezése
app.get("/rooms/getRoomId", async (req, res) => {
  const { roomCode } = req.query;

  if (!roomCode) {
    return res.status(400).json({ error: "Hiányzó roomCode paraméter!" });
  }

  try {
    const [rows] = await req.db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "A szoba nem található." });
    }

    res.json({ RoomID: rows[0].RoomID });
  } catch (error) {
    res.status(500).json({ error: "Szerverhiba történt.", details: error.message });
  }
});

// Szobához tartozó programok lekérdezése szűrőkkel
app.get('/rooms/:roomCode/programs', async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [roomRows] = await db.execute(
      "SELECT RoomID, Filters FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: "A szoba nem található." });
    }

    const filters = roomRows[0].Filters ? JSON.parse(roomRows[0].Filters) : {};
    let query = `
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      LEFT JOIN City c ON p.CityID = c.CityID
      WHERE 1 = 1`;
    const params = [];

    if (filters.cost) {
      query += " AND p.Cost = ?";
      params.push(filters.cost === "paid" ? 1 : 0);
    }
    if (filters.duration) {
      query += " AND p.Duration = ?";
      params.push(parseInt(filters.duration));
    }
    if (filters.city) {
      query += " AND p.CityID = ?";
      params.push(parseInt(filters.city));
    }

    const [programs] = await db.execute(query, params);
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Hiba történt a szobához tartozó programok lekérdezésekor." });
  }
});

// Szűrők mentése (csak host)
app.post('/rooms/:roomCode/filters', async (req, res) => {
  const { roomCode } = req.params;
  const { filters, userId } = req.body;

  try {
    const [roomRows] = await db.execute(
      'SELECT CreatorUserID FROM Rooms WHERE RoomCode = ?',
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: 'Szoba nem található.' });
    }

    const creatorUserId = roomRows[0].CreatorUserID;

    if (creatorUserId !== userId) {
      return res.status(403).json({ error: 'Csak a szoba létrehozója állíthatja a szűrőket.' });
    }

    await db.execute(
      'UPDATE Rooms SET Filters = ? WHERE RoomCode = ?',
      [JSON.stringify(filters), roomCode]
    );

    res.json({ message: 'Szűrők sikeresen frissítve.' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba a szűrők frissítése közben.' });
  }
});

// Szűrők lekérdezése
app.get('/rooms/:roomCode/filters', async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [roomRows] = await db.execute(
      'SELECT Filters FROM Rooms WHERE RoomCode = ?',
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: 'Szoba nem található.' });
    }

    const filters = roomRows[0].Filters ? JSON.parse(roomRows[0].Filters) : null;
    res.json(filters);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a szűrők lekérése közben.' });
  }
});

// Összegzés: szoba program kiválasztása (room + program + user)
app.post('/summary/choose', async (req, res) => {
  const { roomCode, userId, programId } = req.body;

  try {
    const [roomResult] = await db.query('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
    if (roomResult.length === 0) {
      return res.status(404).json({ message: 'A szoba nem található' });
    }
    const roomId = roomResult[0].RoomID;

    await db.query(`
      INSERT INTO RoomSwipeLikes (RoomID, UserID, ProgramID, LikedAt)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE LikedAt = NOW()
    `, [roomId, userId, programId]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a lájk mentésekor', error: err.message });
  }
});

// Kedvelt programok lekérése (felhasználónként vagy szobánként)
app.get("/programs/liked", async (req, res) => {
  let { userId, roomId } = req.query;
  if (!userId && !roomId) {
    return res.status(400).json({ error: "Hiányzó userId vagy roomId paraméter." });
  }

  try {
    let query, params;
    if (roomId) {
      const [roomResult] = await req.db.execute(
        "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
        [roomId]
      );
      if (roomResult.length === 0) return res.status(404).json({ error: "A szoba nem található." });

      const realRoomId = roomResult[0].RoomID;
      query = `
        SELECT p.*, COUNT(ua.UserID) AS likeCount
        FROM Programs p
        JOIN UserActions ua ON p.ProgramID = ua.ProgramID
        WHERE ua.RoomID = ? AND ua.Action = 'like'
        GROUP BY p.ProgramID
      `;
      params = [realRoomId];
    } else {
      query = `
        SELECT p.* FROM Programs p
        JOIN UserActions ua ON p.ProgramID = ua.ProgramID
        WHERE ua.UserID = ? AND ua.Action = 'like'
      `;
      params = [userId];
    }

    const [likedPrograms] = await req.db.execute(query, params);
    return res.json(likedPrograms);
  } catch (error) {
    res.status(500).json({ error: "Szerverhiba a kedvelt programok betöltésekor." });
  }
});

// Kedvelt programok törlése egy adott userhez
app.delete("/programs/liked/reset", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Hiányzó userId!" });

  try {
    await db.query("DELETE FROM UserLikes WHERE UserID = ?", [userId]);
    res.status(200).json({ message: "Kedvelt programok törölve." });
  } catch (err) {
    res.status(500).json({ error: "Hiba történt a törlés során." });
  }
});

// Szoba alapú kedvelt programok összegzése
app.get('/rooms/:roomCode/liked-programs', async (req, res) => {
  const { roomCode } = req.params;
  try {
    const [room] = await db.query('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
    if (room.length === 0) return res.status(404).json({ message: 'A szoba nem található' });
    const roomId = room[0].RoomID;

    const [programs] = await db.query(`
      SELECT 
        p.ProgramID,
        p.Name,
        p.Description,
        c.Name AS CityName,
        p.Location,
        p.Image,
        p.Duration,
        p.Cost,
        COUNT(rsl.UserID) AS likeCount
      FROM RoomSwipeLikes rsl
      JOIN Programs p ON rsl.ProgramID = p.ProgramID
      LEFT JOIN City c ON p.CityID = c.CityID
      WHERE rsl.RoomID = ?
      GROUP BY p.ProgramID
      ORDER BY likeCount DESC
    `, [roomId]);

    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: "Nem sikerült betölteni a kedvelt programokat." });
  }
});

// Véletlenszerű program lekérése (kivéve a korábban like-oltakat)
app.get("/programs/random", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Hiányzó userId paraméter." });

    // Lekérjük a like-olt programokat az adott felhasználótól
    const [likedProgramsRows] = await db.execute(
      "SELECT ProgramID FROM UserLikes WHERE UserID = ?",
      [userId]
    );
    const likedPrograms = likedProgramsRows.map(p => p.ProgramID);

    let sqlQuery, queryParams;
    if (likedPrograms.length > 0) {
      sqlQuery = `SELECT * FROM Programs WHERE ProgramID NOT IN (?) ORDER BY RAND() LIMIT 1`;
      queryParams = [likedPrograms];
    } else {
      sqlQuery = `SELECT p.*, c.Name AS CityName
                  FROM Programs p
                  JOIN City c ON p.CityID = c.CityID
                  ORDER BY RAND() LIMIT 1`;
      queryParams = [];
    }

    const [randomProgramRows] = await db.execute(sqlQuery, queryParams);
    const randomProgram = randomProgramRows.length > 0 ? randomProgramRows[0] : null;

    if (!randomProgram) return res.json(null);
    res.json(randomProgram);
  } catch (error) {
    res.status(500).json({ error: "Szerverhiba a program betöltésekor.", details: error.message });
  }
});

// Program kedvelése (like) route
app.post("/programs/:programId/like", async (req, res) => {
  const { programId } = req.params;
  const { userId, roomCode } = req.body;
  const actualRoomCode = roomCode || req.session.currentRoomCode || null;

  if (!userId || !programId) return res.status(400).json({ error: "Hiányzó userId vagy programId." });

  try {
    const [existingLike] = await req.db.execute(
      "SELECT * FROM UserLikes WHERE UserID = ? AND ProgramID = ?",
      [userId, programId]
    );
    if (existingLike.length > 0) return res.status(400).json({ error: "A program már like-olva van." });

    let roomId = null;
    if (actualRoomCode) {
      const [roomResult] = await req.db.execute(
        "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
        [actualRoomCode]
      );
      if (roomResult.length > 0) roomId = roomResult[0].RoomID;
    }

    await req.db.execute(
      "INSERT INTO SwipeActions (UserID, ProgramID, Action) VALUES (?, ?, 'like')",
      [userId, programId]
    );

    await req.db.execute(
      "INSERT INTO UserLikes (UserID, ProgramID, RoomID) VALUES (?, ?, ?)",
      [userId, programId, roomId]
    );

    res.json({ success: true, message: "Program sikeresen like-olva." });
  } catch (error) {
    res.status(500).json({ error: "Szerverhiba a like mentésekor." });
  }
});

// Program nem kedvelése (dislike)
app.post('/programs/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'UserID szükséges!' });

  try {
    await req.db.execute(
      'INSERT INTO SwipeActions (UserID, ProgramID, Action) VALUES (?, ?, "dislike")',
      [userId, id]
    );
    res.status(200).json({ message: 'A program sikeresen nem kedvelt.' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a program nem kedvelése során.' });
  }
});

// Felhasználó regisztráció
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO Users (Username, PasswordHash, Email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    res.status(201).json({ message: "Sikeres regisztráció!", userID: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Nem sikerült a regisztráció", details: error.message });
  }
});

// Bejelentkezés JWT tokennel és HttpOnly sütivel
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Hiányzó adatok!" });
  }

  try {
    const [users] = await req.db.execute(
      "SELECT UserID, Email, PasswordHash, IsAdmin FROM Users WHERE Email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Hibás email vagy jelszó!" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Hibás jelszó!" });
    }

    const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin }, "jwt_secret_key", { expiresIn: '7d' });

    res.cookie('planup_token', token, { 
      httpOnly: true, 
      secure: false,
      maxAge: 7 * 24 * 3600 * 1000
    });

    res.json({ message: "Sikeres bejelentkezés!", userId: user.UserID });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba történt!" });
  }
});

// Bejelentkezési állapot ellenőrzés JWT alapján
app.get('/api/auth/status', (req, res) => {
  const token = req.cookies.planup_token;

  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, userId: decoded.userId, isAdmin: decoded.isAdmin === 1 || decoded.isAdmin === true });
  });
});

// Export más fáljokhoz
module.exports = { app, io };
