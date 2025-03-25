const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// JWT token ellenőrző middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.planup_token || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Nem vagy bejelentkezve.' });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Érvénytelen vagy lejárt token.' });
    }
    
    req.user = decoded;
    next();
  });
};

// Admin jogosultság ellenőrző middleware
const adminCheck = async (req, res, next) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Nem vagy bejelentkezve.' });
  }

  try {
    const [rows] = await db.execute('SELECT IsAdmin FROM Users WHERE UserID = ?', [req.user.userId]);
    
    if (rows.length === 0 || !rows[0].IsAdmin) {
      return res.status(403).json({ error: 'Nincs admin jogosultságod.' });
    }
    
    next();
  } catch (err) {
    console.error('Admin ellenőrzési hiba:', err);
    return res.status(500).json({ error: 'Szerverhiba jogosultság ellenőrzés közben.' });
  }
};

// Multer konfiguráció
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Először autentikáljuk a tokent, aztán ellenőrizzük az admin jogosultságot
router.use(authenticateToken);
router.use(adminCheck);




// Képfeltöltés API
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    const filePath = `/images/${req.file.filename}`; // Kép elérési útja a public mappán belül
    res.json({ filePath });
  } catch (error) {
    console.error('Hiba történt a képfeltöltés során:', error);
    res.status(500).json({ error: 'Hiba történt a képfeltöltés során.' });
  }
});

// Felhasználók lekérése
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a felhasználók lekérésekor.' });
  }
});

// Felhasználó hozzáadása
router.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO Users (Name, Email) VALUES (?, ?)', [name, email]);
    res.json({ message: 'Felhasználó sikeresen hozzáadva.', userId: result.insertId });
  } catch (error) {
    console.error('Hiba történt a felhasználó hozzáadásakor:', error);
    res.status(500).json({ error: 'Hiba történt a felhasználó hozzáadásakor.' });
  }
});

// Program hozzáadása
router.post('/add-program', async (req, res) => {
  const { name, description, duration, cost, location, image, moreInfoLink, city } = req.body;
  try {
    const [cityResult] = await db.execute('SELECT CityID FROM City WHERE Name = ?', [city]);
    
    if (cityResult.length === 0) {
      return res.status(400).json({ error: 'Nincs ilyen város.' });
    }
    
    const cityID = cityResult[0].CityID;
    
    await db.execute(
      'INSERT INTO Programs (Name, Description, Duration, Cost, Location, Image, MoreInfoLink, CityID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, duration, cost ? true : false, location, image, moreInfoLink, cityID]
    );
    
    res.json({ message: 'Program sikeresen hozzáadva!' });
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt a program hozzáadásakor.' });
  }
});

// Programok listázása
router.get('/programs', async (req, res) => {
  try {
    const [programs] = await db.execute(`
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      ORDER BY RAND() ASC
    `);
    
    res.json(programs);
  } catch (error) {
    console.error('Hiba történt a programok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a programok lekérésekor.' });
  }
});

// Program szerkesztése
router.put('/programs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, duration, cost, location, image, moreInfoLink } = req.body;
  
  try {
    await db.execute(
      `UPDATE Programs SET Name = ?, Description = ?, Duration = ?, Cost = ?, Location = ?, Image = ?, MoreInfoLink = ? WHERE ProgramID = ?`, 
      [name, description, duration, cost ? true : false, location, image, moreInfoLink, id]
    );
    
    res.json({ message: 'Program sikeresen frissítve!' });
  } catch (error) {
    console.error('Hiba történt a program frissítésekor:', error);
    res.status(500).json({ error: 'Hiba történt a program frissítésekor.' });
  }
});

// Program törlése
router.delete('/programs/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Ellenőrizzük, hogy létezik-e a program
    const [program] = await db.execute('SELECT * FROM Programs WHERE ProgramID = ?', [id]);
    
    if (program.length === 0) {
      return res.status(404).json({ error: 'A program nem található.' });
    }
    
    // Ellenőrizzük, hogy vannak-e kapcsolódó rekordok
    const [userLikes] = await db.execute('SELECT COUNT(*) as count FROM UserLikes WHERE ProgramID = ?', [id]);
    const [swipeActions] = await db.execute('SELECT COUNT(*) as count FROM SwipeActions WHERE ProgramID = ?', [id]);
    
    // Ha vannak kapcsolódó rekordok, először azokat töröljük
    if (userLikes[0].count > 0) {
      await db.execute('DELETE FROM UserLikes WHERE ProgramID = ?', [id]);
    }
    
    if (swipeActions[0].count > 0) {
      await db.execute('DELETE FROM SwipeActions WHERE ProgramID = ?', [id]);
    }
    
    // Töröljük a programot
    await db.execute('DELETE FROM Programs WHERE ProgramID = ?', [id]);
    res.json({ message: 'Program sikeresen törölve!' });
  } catch (error) {
    console.error('Hiba történt a program törlésekor:', error);
    res.status(500).json({ error: 'Hiba történt a program törlésekor.' });
  }
});

// Városok lekérése
router.get('/cities', async (req, res) => {
  try {
    const [cities] = await db.execute('SELECT Name FROM City ORDER BY Name ASC');
    res.json(cities.map(city => city.Name));
  } catch (error) {
    console.error('Hiba történt a városok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a városok lekérésekor.' });
  }
});

// Felhasználó kitiltása
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Előbb minden kapcsolódó adat törlése
    await db.execute('DELETE FROM RoomParticipants WHERE UserID = ?', [id]); // Ez hiányzott
    await db.execute('DELETE FROM UserLikes WHERE UserID = ?', [id]);
    await db.execute('DELETE FROM SwipeActions WHERE UserID = ?', [id]);

    // Most már törölhető a felhasználó
    await db.execute('DELETE FROM Users WHERE UserID = ?', [id]);

    res.json({ message: 'Felhasználó sikeresen törölve.' });
  } catch (error) {
    console.error('❌ Hiba a felhasználó törlésekor:', error.message);
    res.status(500).json({ error: 'Hiba a felhasználó törlésekor.', details: error.message });
  }
});


module.exports = router;
