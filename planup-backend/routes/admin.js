// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');
const app = express();

router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérésekor:', error);
    res.status(500).json({ error: 'Hiba történt a felhasználók lekérésekor.' });
  }
});

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

router.delete('/delete-user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.execute('DELETE FROM Users WHERE id = ?', [id]);
    res.json({ message: 'Felhasználó sikeresen törölve.' });
  } catch (error) {
    console.error('Hiba történt a felhasználó törlésekor:', error);
    res.status(500).json({ error: 'Hiba történt a felhasználó törlésekor.' });
  }
});


router.post('/add-program', async (req, res) => {
  const { name, description, duration, cost, location, image, moreInfoLink, city } = req.body;

  try {
      const [cityResult] = await req.db.execute('SELECT CityID FROM City WHERE Name = ?', [city]);
      if (cityResult.length === 0) {
          return res.status(400).json({ error: 'Nincs ilyen város.' });
      }
      const cityID = cityResult[0].CityID;

      await req.db.execute(
          'INSERT INTO Programs (Name, Description, Duration, Cost, Location, Image, MoreInfoLink, CityID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [name, description, duration, cost ? true : false, location, image, moreInfoLink, cityID]
      );

      res.json({ message: 'Program sikeresen hozzáadva!' });
  } catch (error) {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Hiba történt a program hozzáadásakor.' });
  }
});
// Városok lekérése route
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
