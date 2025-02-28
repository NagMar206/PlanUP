const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');

// Bejelentkezés
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'A felhasználó nem található.' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Helytelen jelszó.' });
    }

    // JWT token generálás
    const token = jwt.sign({ id: user.UserID, email: user.Email }, 'secret_key', { expiresIn: '1h' });

    res.json({ message: 'Sikeres bejelentkezés!', token, userId: user.UserID });
  } catch (error) {
    console.error('Hiba a bejelentkezés során:', error);
    res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
  }
});

module.exports = router;
