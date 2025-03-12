const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid'); // UUID importálása

router.post('/', async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'A szoba neve és a felhasználói azonosító kötelező!' });
  }

  try {
    const db = await mysql.createConnection(dbConfig);
    console.log("🔌 Adatbázis kapcsolat sikeres!");

    const [rooms] = await db.execute('SELECT * FROM Rooms');
    console.log("📊 Szobák lekérdezve:", rooms);

    await db.end();
    res.status(200).json(rooms);
} catch (error) {
    console.error("🔥 Hiba történt a szobák lekérdezése során:", error.message);
    res.status(500).json({ error: 'Hiba történt a szobák lekérdezése során', details: error.message });
}

});

// Szobák listázása
router.get('/', async (req, res) => {
  try {
      console.log("🔌 Teszt: kapcsolat létrehozása az adatbázishoz...");
      const [rooms] = await db.execute('SELECT * FROM Rooms'); // 🔹 db.execute helyes hívása
      console.log("📊 Szobák sikeresen lekérdezve:", rooms);
      res.status(200).json(rooms);
  } catch (error) {
      console.error("🔥 Hiba történt a szobák lekérdezése során:", error.message);
      res.status(500).json({ error: 'Hiba történt a szobák lekérdezése során', details: error.message });
  }
});

// Szobához csatlakozás
router.post('/join', async (req, res) => {
    const { roomCode, userId } = req.body;

    if (!roomCode || !userId) {
        return res.status(400).json({ error: 'A szobakód és a felhasználó ID szükséges!' });
    }

    try {
        const db = await mysql.createConnection(dbConfig);
        const [roomResult] = await db.execute('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);

        if (roomResult.length === 0) {
            await db.end();
            return res.status(404).json({ error: 'A megadott szobakód nem létezik!' });
        }

        const roomId = roomResult[0].RoomID;
        await db.execute('INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)', [roomId, userId]);
        await db.end();
        res.status(200).json({ message: 'Sikeresen csatlakoztál a szobához!' });
    } catch (error) {
        console.error('Hiba a szobához csatlakozás során:', error.message);
        res.status(500).json({ error: 'Hiba történt a szobához csatlakozás során.', details: error.message });
    }
});

// Szoba törlése
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const db = await mysql.createConnection(dbConfig);
      await db.execute('DELETE FROM RoomParticipants WHERE RoomID = ?', [id]);
      const [result] = await db.execute('DELETE FROM Rooms WHERE RoomID = ?', [id]);
      await db.end();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Nem található szoba a megadott ID alapján.' });
      }

      res.status(200).json({ message: 'Szoba sikeresen törölve.' });
    } catch (err) {
      console.error('Törlési hiba:', err.message);
      res.status(500).json({ error: 'Hiba történt a szoba törlésekor.', details: err.message });
    }
});

module.exports = router;