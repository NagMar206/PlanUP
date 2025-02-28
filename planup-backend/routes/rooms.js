const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

router.post('/', async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'A szoba neve és a felhasználói azonosító kötelező!' });
  }

  try {
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      'INSERT INTO Rooms (RoomCode, CreatedByUserID) VALUES (?, ?)',
      [name, userId]
    );
    await db.end();
    res.status(201).json({ message: 'Szoba sikeresen létrehozva!', roomId: result.insertId });
  } catch (err) {
    console.error('Hiba a szoba létrehozása során:', err.message);
    res.status(500).json({ error: 'Nem sikerült létrehozni a szobát.', details: err.message });
  }
});





// Szobák listázása
router.get('/', async (req, res) => {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rooms] = await db.execute('SELECT * FROM Rooms');
        await db.end();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a szobák lekérdezése során', details: error.message });
    }
});

// Szobához csatlakozás
router.post('/join', async (req, res) => {
    const { roomId, userId } = req.body;
    console.log('Received data for join:', { roomId, userId });

    if (!roomId || !userId) {
        return res.status(400).json({ error: 'A szoba ID és a felhasználó ID szükséges!' });
    }

    try {
        const db = await mysql.createConnection(dbConfig);
        const [result] = await db.execute(
            'INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)',
            [roomId, userId]
        );
        console.log('Insert result:', result);
        await db.end();
        res.status(200).json({ message: 'Sikeresen csatlakoztál a szobához' });
    } catch (error) {
        console.error('Insert error:', error.message);
        res.status(500).json({ error: 'Hiba történt a szobához csatlakozás során', details: error.message });
    }
});


// Szoba törlése
// Szoba törlése
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const db = await mysql.createConnection(dbConfig);
  
      // Töröljük az összes kapcsolódó sort a RoomParticipants táblából
      await db.execute('DELETE FROM RoomParticipants WHERE RoomID = ?', [id]);
  
      // Töröljük a szobát
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
