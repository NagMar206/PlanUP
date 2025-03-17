// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

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

module.exports = router;
