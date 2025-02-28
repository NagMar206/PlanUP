const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dbConfig = require('./config/dbConfig'); // Adatbázis konfiguráció importálása
const programRoutes = require('./routes/programs'); 
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms'); // Router importálása
const profileRoutes = require('./routes/profiles');
const cookieParser = require("cookie-parser"); //Cookie-k kezelése
const session = require("express-session");
require('dotenv').config();


// Az app inicializálása
const app = express();

// Middleware-ek
app.use(express.json());
app.use(cors());

// 🔹 Statikus fájlok kiszolgálása (FONTOS!)
app.use('/images', express.static('public/images'));
app.use('/images', express.static(__dirname + '/public/images'));

// 🔹 Route-ok regisztrálása
app.use('/rooms', roomRoutes);
app.use('/profile', profileRoutes);

// 🔹 **Globálisan definiáljuk a db változót**
let db;

// Middleware: az adatbázis kapcsolat biztosítása minden kéréshez
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

// Útvonalak regisztrálása
app.use('/programs', programRoutes);
app.use('/rooms', roomRoutes);

// Regisztráció
app.post('/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [result] = await req.db.execute(
      'INSERT INTO Users (Username, PasswordHash, Email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    res.status(201).json({ message: 'User registered successfully', userID: result.insertId });
  } catch (error) {
    console.error('Regisztrációs hiba:', error.message);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// Bejelentkezés (régi)
/*
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Felhasználónév és jelszó szükséges!' });
  }

  try {
    const [users] = await req.db.execute('SELECT * FROM Users WHERE Email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Érvénytelen hitelesítő adatok' });
    }

    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Érvénytelen hitelesítő adatok' });
    }

    res.status(200).json({ message: 'Sikeres bejelentkezés', userID: user.UserID });
  } catch (error) {
    console.error('Bejelentkezési hiba:', error.message);
    res.status(500).json({ error: 'Bejelentkezés sikertelen', details: error.message });
  }
}); */

// Teszt útvonal
app.get('/', (req, res) => {
  res.send('Express.js backend működik!');
});

// Szerver indítása
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
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
app.get('/programs/random', async (req, res) => {
  try {
    const [program] = await req.db.execute('SELECT * FROM Programs ORDER BY RAND() LIMIT 1');

    if (program[0]) {
      program[0].Cost = Boolean(program[0].Cost);
      program[0].Image = `/images/${program[0].Image}`;
    }

    res.status(200).json(program[0] || {});
  } catch (error) {
    console.error('Hiba a véletlenszerű program lekérdezése során:', error.message);
    res.status(500).json({ error: 'Hiba történt egy véletlenszerű program lekérdezése során.' });
  }
});

// 🔹 Program kedvelése   (updated: RoomAPI UserID)
app.post('/programs/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'UserID szükséges!' });
  }

  try {
    await req.db.execute('INSERT INTO SwipeActions (UserID, ProgramID, Action) VALUES (?, ?, "like")', [userId, id]);
    res.status(200).json({ message: 'A program sikeresen kedvelve lett.' });
  } catch (error) {
    console.error('Kedvelési hiba:', error.message);
    res.status(500).json({ error: 'Hiba történt a program kedvelése során.' });
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



//Rooms API UserID cuccok

// CORS beállítás, hogy a frontend elérhesse a szervert
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session middleware beállítása
app.use(session({
  secret: process.env.SESSION_SECRET || "titkoskulcs", // Titkos kulcs beállítása
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // HTTPS esetén legyen true
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 napos lejárat
  }
}));

// Bejelentkezés API
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  db.query("SELECT id, email FROM users WHERE email = ? AND password = ?", 
      [email, password], (err, result) => {
      if (err) return res.status(500).json({ error: "Szerverhiba" });
      if (result.length === 0) return res.status(401).json({ error: "Hibás adatok" });

      req.session.user = result[0]; // Session mentése
      res.json({ message: "Sikeres bejelentkezés!" });
  });
});

// Ellenőrzés, hogy be van-e jelentkezve
app.get("/user", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Nincs bejelentkezve" });
  res.json(req.session.user);
});

// Kijelentkezés API
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
      res.json({ message: "Sikeres kijelentkezés!" });
  });
});

