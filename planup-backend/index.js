const express = require('express');
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

require('dotenv').config();

const app = express();

// 🔹 1) MINDIG ELŐSZÖR a middleware-ek:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS beállítás
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));

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

// Session beállítás
if (!process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET nincs beállítva az .env fájlban! ");
}
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_fallback',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

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



// 🔹 3) Statikus fájlok (ha kell)
app.use('/images', express.static('public/images'));

// 🔹 4) Végül a szerver indítása
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Szerver fut: http://localhost:${PORT}`);
});




// 🔹 Statikus fájlok kiszolgálása (FONTOS!)
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
      sqlQuery = `SELECT * FROM Programs ORDER BY RAND() LIMIT 1`;
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

  if (!userId || !programId) {
    console.error("❌ Hiányzó userId vagy programId a like kérésben!");
    return res.status(400).json({ error: "Hiányzó userId vagy programId." });
  }

  try {
    console.log(`🔍 Like kérés beérkezett: UserID = ${userId}, ProgramID = ${programId}`);

    // Ellenőrizzük, hogy a user már like-olta-e ezt a programot
    const [existingLike] = await db.execute(
      "SELECT * FROM UserLikes WHERE UserID = ? AND ProgramID = ?",
      [userId, programId]
    );

    if (existingLike.length > 0) {
      console.log(`⚠️ UserID (${userId}) már like-olta ezt a programot (ProgramID: ${programId})`);
      return res.status(400).json({ error: "A program már like-olva van." });
    }

    // Like mentése az adatbázisba
    await db.execute("INSERT INTO UserLikes (UserID, ProgramID) VALUES (?, ?)", [userId, programId]);

    console.log(`👍 Program (${programId}) sikeresen like-olva UserID (${userId}) által`);

    res.json({ success: true, message: "Program sikeresen like-olva." });
  } catch (error) {
    console.error("🔥 Hiba történt a like mentésekor:", error);
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
  const { userId } = req.query;

  if (!userId) {
    console.error("❌ Hiányzó userId paraméter!");
    return res.status(400).json({ error: "Hiányzó userId paraméter." });
  }

  console.log(`🔍 Aktív felhasználó ID: ${userId}`);

  try {
    const [likedPrograms] = await db.execute(`
      SELECT p.*, COUNT(ul.ProgramID) AS LikesCount
      FROM Programs p
      JOIN UserLikes ul ON p.ProgramID = ul.ProgramID
      WHERE ul.UserID = ?
      GROUP BY p.ProgramID
      ORDER BY LikesCount DESC
    `, [userId]);

    console.log("✅ Lekérdezett kedvelt programok:", likedPrograms);
    res.json(likedPrograms);
  } catch (error) {
    console.error("🔥 Hiba történt a kedvelt programok lekérésekor:", error);
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


// Session middleware beállítása
app.use(session({
  secret: process.env.SESSION_SECRET, // Titkos kulcs beállítása
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // HTTPS esetén legyen true
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 napos lejárat
  }
}));

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

    const token = jwt.sign({ userId: user.UserID }, "jwt_secret_key", { expiresIn: '7d' });

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
  const token = req.cookies.planup_auth_token;

  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, userId: decoded.userId });
  });
});

