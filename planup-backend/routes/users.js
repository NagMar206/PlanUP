const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');

const router = express.Router();

// Bejelentkezés
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT UserID, Email, PasswordHash FROM Users WHERE Email = ?', [email]);

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

        // 🔹 Token beállítása HttpOnly sütiben
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Ha HTTPS lenne, akkor true
            maxAge: 1000 * 60 * 60 * 1, // 1 óra
        });

        res.json({ message: 'Sikeres bejelentkezés!', userId: user.UserID });
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
    }
});

// Regisztráció
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)', 
                      [username, email, hashedPassword]);

        res.status(201).json({ message: "Sikeres regisztráció!" });
    } catch (error) {
        console.error('Hiba a regisztráció során:', error);
        res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
    }
});

module.exports = router;
