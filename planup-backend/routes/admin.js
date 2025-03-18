// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');
const app = express();

// Middleware az admin jogosultság ellenőrzésére
const verifyAdmin = async (req, res, next) => {
  if (!req.user?.userId) {
      return res.status(401).json({ error: "Nincs jogosultság! (UserID hiányzik)" });
  }

  if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Hozzáférés megtagadva! Nem vagy admin." });
  }

  next();
};

// Csak adminok férhetnek hozzá
router.get('/users', verifyAdmin, async (req, res) => {
try {
  const [users] = await db.execute('SELECT * FROM Users');
  res.json(users);
} catch (error) {
  console.error('❌ Hiba a felhasználók lekérésekor:', error);
  res.status(500).json({ error: 'Szerverhiba történt a felhasználók lekérésekor.' });
}
});

// Admin jogosultsággal program hozzáadása
router.post('/add-program', verifyAdmin, async (req, res) => {
const { name, description, duration, cost, location, image, moreInfoLink, city } = req.body;

try {
  const [cityResult] = await db.execute('SELECT CityID FROM City WHERE Name = ?', [city]);
  if (cityResult.length === 0) {
    return res.status(400).json({ error: 'Nincs ilyen város.' });
  }

  await db.execute(
    'INSERT INTO Programs (Name, Description, Duration, Cost, Location, Image, MoreInfoLink, CityID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, duration, cost ? true : false, location, image, moreInfoLink, cityResult[0].CityID]
  );

  res.json({ message: '✅ Program sikeresen hozzáadva!' });
} catch (error) {
  console.error('❌ Hiba történt:', error);
  res.status(500).json({ error: 'Szerverhiba történt a program hozzáadásakor.' });
}
});

// Városok lekérése route
router.get('/cities', async (req, res) => {
  try {
    const [cities] = await req.db.execute('SELECT Name FROM City ORDER BY Name ASC');
    res.json(cities.map(city => city.Name));
  } catch (error) {
    console.error('Hiba történt a városok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a városok lekérésekor.' });
  }
});









module.exports = router;
