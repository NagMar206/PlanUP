const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

// Szoba létrehozása - most már random kóddal
router.post('/', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'A felhasználói azonosító kötelező!' });
    }
    

    try {
        const roomCode = uuidv4().substring(0, 8).toUpperCase();
        await db.execute('INSERT INTO Rooms (RoomCode, CreatedByUserID) VALUES (?, ?)', [roomCode, userId]);
        res.status(200).json({ message: 'Szoba létrehozva!', roomCode });
    } catch (error) {
        console.error('🔥 Hiba a szoba létrehozásakor:', error.message);
        res.status(500).json({ error: 'Hiba történt a szoba létrehozásakor.', details: error.message });
    }
});

// Szobához csatlakozás
router.post('/join', async (req, res) => {
    const { roomCode, userId } = req.body;
    if (!roomCode || !userId) {
        return res.status(400).json({ error: 'A szobakód és a felhasználó ID szükséges!' });
    }

    try {
        const [roomResult] = await db.execute('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
        if (roomResult.length === 0) {
            return res.status(404).json({ error: 'A megadott szobakód nem létezik!' });
        }

        const roomId = roomResult[0].RoomID;
        await db.execute('INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)', [roomId, userId]);
        res.status(200).json({ message: 'Sikeresen csatlakoztál a szobához!' });
    } catch (error) {
        console.error('Hiba a szobához csatlakozás során:', error.message);
        res.status(500).json({ error: 'Hiba történt a szobához csatlakozás során.', details: error.message });
    }
});

module.exports = router;