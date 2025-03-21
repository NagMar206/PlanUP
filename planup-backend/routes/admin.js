// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

// 📌 Felhasználók lekérése
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a felhasználók lekérésekor.' });
  }
});

// 📌 Felhasználó hozzáadása
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

// 📌 Felhasználó törlése
router.delete('/programs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM Programs WHERE ProgramID = ?', [id]);
    res.json({ message: 'Program sikeresen törölve!' });
  } catch (error) {
    console.error('Hiba történt a program törlésekor:', error);
    res.status(500).json({ error: 'Hiba történt a program törlésekor.' });
  }
});

// 📌 Program hozzáadása
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

// 📌 Programok listázása
router.get('/programs', async (req, res) => {
  try {
    const [programs] = await db.execute(`
      SELECT ProgramID, Name, Description, Duration, Cost, Location, Image, MoreInfoLink 
      FROM Programs 
      ORDER BY Name ASC
    `);
    res.json(programs);
  } catch (error) {
    console.error('Hiba történt a programok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a programok lekérésekor.' });
  }
});

// 📌 Program részleteinek lekérése
router.get('/programs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [program] = await db.execute(`
      SELECT ProgramID, Name, Description, Duration, Cost, Location, Image, MoreInfoLink 
      FROM Programs 
      WHERE ProgramID = ?
    `, [id]);

    if (program.length === 0) {
      return res.status(404).json({ error: 'A program nem található.' });
    }

    res.json(program[0]);
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Hiba történt.' });
  }
});


// 📌 Program szerkesztése
router.put('/programs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, duration, cost, location, image, moreInfoLink } = req.body;

  try {
    await db.execute(`
      UPDATE Programs 
      SET Name = ?, Description = ?, Duration = ?, Cost = ?, Location = ?, Image = ?, MoreInfoLink = ?
      WHERE ProgramID = ?
    `, [name, description, duration, cost ? true : false, location, image, moreInfoLink, id]);

    res.json({ message: 'Program sikeresen frissítve!' });
  } catch (error) {
    console.error('Hiba történt a program frissítésekor:', error);
    res.status(500).json({ error: 'Hiba történt a program frissítésekor.' });
  }
});

// 📌 Program törlése
router.delete('/programs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ellenőrizzük, hogy létezik-e a program
    const [program] = await db.execute('SELECT * FROM Programs WHERE ProgramID = ?', [id]);
    if (program.length === 0) {
      return res.status(404).json({ error: 'A program nem található.' });
    }

    // Töröljük a programot
    await db.execute('DELETE FROM Programs WHERE ProgramID = ?', [id]);
    res.json({ message: 'Program sikeresen törölve!' });
  } catch (error) {
    console.error('Hiba történt a program törlésekor:', error);
    res.status(500).json({ error: 'Hiba történt a program törlésekor.' });
  }
});


// 📌 Városok lekérése
router.get('/cities', async (req, res) => {
  try {
    const [cities] = await db.execute('SELECT Name FROM City ORDER BY Name ASC');
    res.json(cities.map(city => city.Name));
  } catch (error) {
    console.error('Hiba történt a városok lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a városok lekérésekor.' });
  }
});

module.exports = router;
