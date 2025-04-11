const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const db = require('./config/dbConfig'); 
const programRoutes = require('./routes/programs'); 
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const profileRoutes = require('./routes/profile');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')
const multer = require('multer');
const path = require('path');
SESSION_SECRET="125eef9d70e5e65deb3e877eca66f1d805463e8062390de14b33bdad0ba58b8a";
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);  // 🛠️ KELL egy HTTP szerver is!

const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});

server.listen(3001, () => {
  console.log('✅ Szerver fut a 3001-es porton');
});


// 🔥 Ezzel a sorral elérhetővé tesszük a `req.app.get('io')` hívást!
app.set('io', io);

// 🔹 1) MINDIG ELŐSZÖR a middleware-ek:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.io = io;
  next();
});


// CORS beállítás
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
};
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Ha van más “header override”, mint pl. Access-Control-Allow, azt is tedd ide
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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

// Statikus fájlok kiszolgálása (képek elérhetősége)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Multer konfiguráció (képfeltöltés)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // ide menti a képeket
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // egyedi fájlnév
  }
});
const upload = multer({ storage: storage });

// Képfeltöltés route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nincs feltöltött kép!' });
  }
  res.status(200).json({
    message: 'Kép sikeresen feltöltve!',
    filePath: `${req.file.filename}` // csak a fájlnevet adja vissza
  });
});



// 🔹 2) Ezután jöjjenek a ROUTE-ok
// Adatbázis kapcsolat betöltése minden kéréshez
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

// Itt regisztráld a routes
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/rooms', roomRoutes);
app.use('/profile', profileRoutes);
app.use('/programs', programRoutes);
app.use("/api/admin", adminRoutes);





// 🔹 Statikus fájlok kiszolgálása
app.use('/images', express.static('public/images'));
app.use('/images', express.static(__dirname + '/public/images'));


// Regisztráció   
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔍 Regisztráció indult, beérkező adatok:", req.body);

  if (!username || !email || !password) {
    console.error("⚠️ Hiányzó adat!");
    return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO Users (Username, PasswordHash, Email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    console.log("✅ Sikeres regisztráció! UserID:", result.insertId);
    res.status(201).json({ message: "Sikeres regisztráció!", userID: result.insertId });
  } catch (error) {
    console.error("🔥 Hiba a regisztráció során:", error.message);
    res.status(500).json({ error: "Nem sikerült a regisztráció", details: error.message });
  }
});




// Teszt útvonal
app.get('/', (req, res) => {
  res.send('Express.js backend működik!');
});


// 🔹 Program funkciók
app.get('/programs', async (req, res) => {
  const { cost, duration } = req.query;

  let query = "SELECT ProgramID, Name, Description, Duration, Cost, Location, Image FROM Programs WHERE 1=1";
const params = [];

if (cost !== undefined) {
  query += " AND Cost = ?";
  params.push(cost === 'true' ? 1 : 0);
}

if (duration !== undefined) {
  query += " AND Duration = ?";
  params.push(parseInt(duration, 10));
}


  try {
    const [programs] = await req.db.execute(query, params);

    const formattedPrograms = programs.map(prog => ({
      ...prog,
      Cost: Boolean(prog.Cost),
      Image: prog.Image.startsWith('/images/') ? prog.Image : `/images/${prog.Image}` // Helyes képútvonal biztosítása
    }));

    res.status(200).json(formattedPrograms);
  } catch (error) {
    console.error('Hiba történt a programok szűrése során:', error.message);
    res.status(500).json({ error: 'Hiba történt a programok szűrése során.' });
  }
});

// 🔹 Véletlenszerű program lekérése
app.get("/programs/random", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      console.error("❌ Hiányzó userId paraméter!");
      return res.status(400).json({ error: "Hiányzó userId paraméter." });
    }

    console.log(`🔍 Véletlenszerű program lekérése UserID = ${userId}`);

    let likedPrograms = [];
    try {
      const [likedProgramsRows] = await db.execute(
        "SELECT ProgramID FROM UserLikes WHERE UserID = ?",
        [userId]
      );
      likedPrograms = likedProgramsRows.map(p => p.ProgramID);
      console.log("👍 Like-olt programok:", likedPrograms);
    } catch (dbError) {
      console.error("⚠️ Hiba a like-olt programok lekérésekor:", dbError);
      return res.status(500).json({ error: "Hiba a like-olt programok lekérésekor.", details: dbError.message });
    }

    let sqlQuery, queryParams;

    if (likedPrograms.length > 0) {
      sqlQuery = `SELECT * FROM Programs WHERE ProgramID NOT IN (?) ORDER BY RAND() LIMIT 1`;
      queryParams = [likedPrograms];
    } else {
      sqlQuery = `SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      ORDER BY RAND() 
      LIMIT 1`;
      queryParams = [];
    }

    console.log("🔍 SQL Lekérdezés:", sqlQuery, queryParams);

    let randomProgram;
    try {
      const [randomProgramRows] = await db.execute(sqlQuery, queryParams);
      randomProgram = randomProgramRows.length > 0 ? randomProgramRows[0] : null;
    } catch (sqlError) {
      console.error("⚠️ Hiba az SQL lekérdezés végrehajtásakor:", sqlError);
      return res.status(500).json({ error: "SQL hiba a program lekérésekor.", details: sqlError.message });
    }

    if (!randomProgram) {
      console.log("⚠️ Nincs több elérhető program.");
      return res.json(null);
    }

    console.log("🎯 Visszaküldött program:", randomProgram);
    res.json(randomProgram);

  } catch (error) {
    console.error("🔥 Általános hiba történt a random program lekérésekor:", error);
    res.status(500).json({ error: "Szerverhiba a program betöltésekor.", details: error.message });
  }
});


// 🔹 Program kedvelése
app.post("/programs/:programId/like", async (req, res) => {
  const { programId } = req.params;
  const { userId } = req.body;
  const roomCode = req.body.roomCode || req.session.currentRoomCode || null; // Aktuális szobakód sessionből, ha nincs megadva
 
  if (!userId || !programId) {
    return res.status(400).json({ error: "Hiányzó userId vagy programId." });
  }
 
  try {
    console.log(`🔍 Like kérés: UserID = ${userId}, ProgramID = ${programId}, RoomCode = ${roomCode || "Nincs"}`);
 
    // Ellenőrizzük, hogy a user már like-olta-e ezt a programot
    const [existingLike] = await req.db.execute(
      "SELECT * FROM UserLikes WHERE UserID = ? AND ProgramID = ?",
      [userId, programId]
    );
 
    if (existingLike.length > 0) {
      return res.status(400).json({ error: "A program már like-olva van." });
    }
 
    let roomId = null;
    if (roomCode) {
      const [roomResult] = await req.db.execute(
        "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
        [roomCode]
      );
 
      if (roomResult.length > 0) {
        roomId = roomResult[0].RoomID;
      }
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
    console.error("🔥 Hiba a like mentésekor:", error);
    res.status(500).json({ error: "Szerverhiba a like mentésekor." });
  }
});


// 🔹 Program elutasítása
app.post('/programs/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'UserID szükséges!' });
  }

  try {
    await req.db.execute('INSERT INTO SwipeActions (UserID, ProgramID, Action) VALUES (?, ?, "dislike")', [userId, id]);
    res.status(200).json({ message: 'A program sikeresen nem kedvelt.' });
  } catch (error) {
    console.error('Nem kedvelési hiba:', error.message);
    res.status(500).json({ error: 'Hiba történt a program nem kedvelése során.' });
  }
});



// 🔹 Összegzés
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
      if (roomResult.length === 0) {
        return res.status(404).json({ error: "A szoba nem található." });
      }
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
    console.error("🔥 Hiba a kedvelt programok lekérésekor:", error);
    res.status(500).json({ error: "Szerverhiba a kedvelt programok betöltésekor." });
  }
});




//Liked program reset
app.delete("/programs/liked/reset", async (req, res) => {
  const { userId } = req.body; // Fontos: req.body-ból kapjuk az adatokat!
  
  if (!userId) return res.status(400).json({ error: "Hiányzó userId!" });

  try {
    await db.query("DELETE FROM UserLikes WHERE UserID = ?", [userId]);
    res.status(200).json({ message: "Kedvelt programok törölve." });
  } catch (err) {
    console.error("Hiba:", err);
    res.status(500).json({ error: "Hiba történt a törlés során." });
  }
});

//Rooms lájkolt programok
app.get('/rooms/:roomCode/liked-programs', async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [room] = await db.query('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
    if (room.length === 0) {
      return res.status(404).json({ message: 'A szoba nem található' });
    }

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
    console.error("❌ Hiba a liked-programs lekérdezésnél:", err);
    res.status(500).json({ message: "Nem sikerült betölteni a kedvelt programokat." });
  }
});




//Bejelentkezés API (régi)

/*
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Hiányzó adatok!" });
  }

  try {
    const [users] = await req.db.execute(
      "SELECT UserID, Email, PasswordHash FROM Users WHERE Email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Hibás bejelentkezési adatok!" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Hibás jelszó!" });
    }

    req.session.user = { id: user.UserID, email: user.Email };
    res.json({ message: "✅ Sikeres bejelentkezés!", user: req.session.user });
  } catch (error) {
    console.error("🔥 Bejelentkezési hiba:", error.message);
    res.status(500).json({ error: "Szerverhiba!" });
  }
});

// Ellenőrzés, hogy be van-e jelentkezve
app.get("/api/users/status", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false, error: "Nincs bejelentkezve!" });
  }
  res.json({ loggedIn: true, user: req.session.user });
})

// Kijelentkezés API
app.post("/api/users/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "👋 Sikeres kijelentkezés!" });
  });
});

*/

// Backend: index.js (JWT autentikáció + cookie-k kezelése integrálva)
const jwt = require('jsonwebtoken');

// Bejelentkezés (JWT + cookie)
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Hiányzó adatok!" });
  }

  try {
    const [users] = await req.db.execute(
      "SELECT UserID, Email, PasswordHash FROM Users WHERE Email = ?",
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

// Felhasználó ellenőrzése JWT alapján
app.get('/api/auth/status', (req, res) => {
  const token = req.cookies.planup_token;

  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, userId: decoded.userId, isAdmin: decoded.isAdmin === 1 || decoded.isAdmin === true });
  });
});


io.on("connection", (socket) => {
  console.log("🟢 Egy felhasználó csatlakozott: " + socket.id);

  socket.on("joinRoom", async (roomCode, userId) => {
    socket.join(roomCode);
    console.log(`👥 Felhasználó (${userId}) csatlakozott a szobához: ${roomCode}`);

    try {
      const [roomResult] = await db.execute(
        "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
        [roomCode]
      );

      if (roomResult.length > 0) {
        await db.execute("DELETE FROM UserLikes WHERE UserID = ?", [userId]);
        await db.execute("DELETE FROM SwipeActions WHERE UserID = ?", [userId]);

        console.log(`🗑️ Felhasználó (${userId}) korábbi lájkjai sikeresen törölve.`);
      } else {
        console.log("⚠️ Nem található szoba ezzel a kóddal:", roomCode);
      }
    } catch (error) {
      console.error("🔥 Hiba a lájkok törlése során:", error);
    }
  });
});


// ✅ RoomCode alapján RoomID visszaadása
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
      console.error("🔥 Hiba a RoomID lekérdezésekor:", error.message);
      res.status(500).json({ error: "Szerverhiba történt." });
  }
});

app.get('/rooms/:roomCode/programs', async (req, res) => {
  const { roomCode } = req.params;

  try {
    // Lekérjük a RoomID-t a RoomCode alapján
    const [roomRows] = await db.execute(
      "SELECT RoomID, Filters FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: "A szoba nem található." });
    }

    const roomId = roomRows[0].RoomID;
    const filters = roomRows[0].Filters ? JSON.parse(roomRows[0].Filters) : {};

    // Szűrők alkalmazása (ha vannak)
    let query = `
      SELECT p.*, c.Name AS CityName 
      FROM Programs p
      LEFT JOIN City c ON p.CityID = c.CityID
      WHERE 1 = 1
    `;
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
    console.error("🔥 Hiba a szobás programok lekérdezésekor:", error);
    res.status(500).json({ error: "Hiba történt a szobához tartozó programok lekérdezésekor." });
  }
});

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
    console.error("❌ Mentési hiba:", err);
    res.status(500).json({ message: 'Hiba a lájk mentésekor', error: err.message });
  }
});



//RoomsID_Summary

app.get('/rooms/:roomCode/creatorId', async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT CreatedByUserID FROM Rooms WHERE RoomCode = ?',
      [roomCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Szoba nem található.' });
    }

    const creatorId = rows[0].CreatedByUserID;
    res.json({ creatorId });
  } catch (error) {
    console.error('🔥 Hiba a létrehozó lekérdezésekor:', error.message);
    res.status(500).json({ error: 'Szerverhiba történt.' });
  }
});


app.get("/api/room/:roomId/summary", async (req, res) => {
  const { roomId } = req.params;

  try {
      const likedPrograms = await db.collection("roomLikes")
          .aggregate([
              { $match: { roomId } }, // Csak az adott szobára szűrünk
              { $group: { _id: "$programId", count: { $sum: 1 } } }, // Programok összesítése
              { $lookup: { 
                  from: "programs", // Programok táblája
                  localField: "_id",
                  foreignField: "ProgramID",
                  as: "programDetails"
              }},
              { $unwind: "$programDetails" }, // Kibontjuk a részleteket
              { $sort: { count: -1 } } // Legnépszerűbb előre
          ])
          .toArray();

      const formattedResults = likedPrograms.map(p => ({
          _id: p._id,
          name: p.programDetails.Name, // Program neve
          count: p.count // Kedvelések száma
      }));

      res.json(formattedResults);
  } catch (error) {
      console.error("❌ Hiba az összegzés lekérésekor:", error);
      res.status(500).json({ error: "Nem sikerült lekérni az összegzést." });
  }
});

// Szobafilterek mentése (csak host állíthatja)
app.post('/rooms/:roomCode/filters', async (req, res) => {
  const { roomCode } = req.params;
  const { filters, userId } = req.body;

  try {
    // Ellenőrizzük, hogy valóban a host akar-e változtatni
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
    console.error('🔥 Hiba a szűrők mentésekor:', error);
    res.status(500).json({ error: 'Hiba a szűrők frissítése közben.' });
  }
});

// Szobafilterek lekérése
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
    console.error('🔥 Hiba a szűrők lekérésekor:', error);
    res.status(500).json({ error: 'Hiba a szűrők lekérése közben.' });
  }
});


module.exports = { app, io };