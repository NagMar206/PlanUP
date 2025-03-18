// Backend (rooms.js) - Frissítve
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
        // Szoba létrehozása
        await db.execute('INSERT INTO Rooms (RoomCode, CreatedByUserID) VALUES (?, ?)', [roomCode, userId]);
        // 🔥 A létrehozót azonnal hozzáadjuk a résztvevők közé!
        const [roomData] = await db.query('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
        const roomId = roomData[0].RoomID;

        await db.execute('INSERT INTO RoomParticipants (RoomID, UserID, isReady) VALUES (?, ?, FALSE)', [roomId, userId]);

        console.log(`✅ [DEBUG] A szoba létrehozója (UserID: ${userId}) hozzá lett adva a szobába!`);
        req.session.roomCode = roomCode;
        req.session.userId = userId;
        req.session.createdAt = Date.now();
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
        const [existingUser] = await db.execute('SELECT * FROM RoomParticipants WHERE RoomID = ? AND UserID = ?', [roomId, userId]);

        if (existingUser.length > 0) {
            return res.status(200).json({ message: 'Már bent vagy ebben a szobában!', roomCode });
        }

        await db.execute('INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)', [roomId, userId]);
        req.session.roomCode = roomCode;
        req.session.userId = userId;
        req.session.createdAt = Date.now();
        res.status(200).json({ message: 'Sikeresen csatlakoztál a szobához!', roomCode });
    } catch (error) {
        console.error('Hiba a szobához csatlakozás során:', error.message);
        res.status(500).json({ error: 'Hiba történt a szobához csatlakozás során.', details: error.message });
    }
});

// Aktuális szoba lekérdezése a session alapján
router.get('/current', (req, res) => {
    if (req.session.roomCode && (Date.now() - req.session.createdAt) < 7200000) { // 2 óra
        return res.status(200).json({ roomCode: req.session.roomCode });
    }
    res.status(404).json({ error: 'Nincs aktív szoba.' });
});


// Szobában lévő felhasználók és létrehozó lekérdezése
router.get('/:roomCode/users', async (req, res) => {
    const { roomCode } = req.params;

    try {
        // Lekérdezzük a szoba ID-t és a létrehozó UserID-ját
        const [roomResult] = await db.execute('SELECT RoomID, CreatedByUserID FROM Rooms WHERE RoomCode = ?', [roomCode]);
        if (roomResult.length === 0) {
            return res.status(404).json({ error: 'A megadott szobakód nem létezik!' });
        }

        const roomId = roomResult[0].RoomID;
        const creatorId = roomResult[0].CreatedByUserID;

        // Lekérdezzük a létrehozó nevét
        const [creatorResult] = await db.execute('SELECT Username FROM Users WHERE UserID = ?', [creatorId]);
        const creatorName = creatorResult.length > 0 ? creatorResult[0].Username : 'Ismeretlen felhasználó';

        // Lekérdezzük a szobában lévő felhasználókat (kivéve a létrehozót, ha külön kell)
        const [users] = await db.execute(`
            SELECT u.Username 
            FROM RoomParticipants rp
            JOIN Users u ON rp.UserID = u.UserID
            WHERE rp.RoomID = ?
        `, [roomId]);

        res.status(200).json({ users, creator: creatorName });
    } catch (error) {
        console.error('🔥 Hiba a szobában lévő felhasználók lekérdezésekor:', error.message);
        res.status(500).json({ error: 'Hiba történt a szoba felhasználóinak lekérdezésekor.', details: error.message });
    }
});

// Szobából való kilépés
router.post('/leave', async (req, res) => {
    const { userId, roomCode } = req.body;

    if (!userId || !roomCode) {
        console.error('⚠️ Hiányzó adat a kilépéshez:', req.body);
        return res.status(400).json({ error: 'Felhasználói azonosító és szobakód szükséges!' });
    }

    try {
        // Lekérdezzük a szoba ID-ját
        const [roomResult] = await db.execute('SELECT RoomID FROM Rooms WHERE RoomCode = ?', [roomCode]);
        if (roomResult.length === 0) {
            return res.status(404).json({ error: 'A megadott szobakód nem létezik!' });
        }

        const roomId = roomResult[0].RoomID;

        // Ellenőrizzük, hogy a felhasználó valóban benne van-e a szobában
        const [userCheck] = await db.execute('SELECT * FROM RoomParticipants WHERE RoomID = ? AND UserID = ?', [roomId, userId]);
        if (userCheck.length === 0) {
            req.session.roomCode = null;
            req.session.userId = null;
            return res.status(200).json({ message: 'A felhasználó már nem volt a szobában, kilépés sikeres.' });
        }
        // Töröljük a felhasználót a szobából
        await db.execute('DELETE FROM RoomParticipants WHERE RoomID = ? AND UserID = ?', [roomId, userId]);
        console.log(`✅ Felhasználó (${userId}) sikeresen törölve a ${roomCode} szobából.`);
        console.log(`✅ Felhasználó (ID: ${userId}) sikeresen kilépett a szobából (Kód: ${roomCode})`);

        // Session törlése, hogy az oldal újratöltése után ne léptessen vissza
        req.session.roomCode = null;
        req.session.userId = null;

        res.status(200).json({ message: 'Kilépés sikeres!' });
    } catch (error) {
        console.error('🔥 Hiba a szobából való kilépés során:', error.message);
        res.status(500).json({ error: 'Hiba történt a szobából való kilépés során.', details: error.message });
    }
});


// Lekéri egy szoba állapotát
router.get('/:roomCode/readyStatus', async (req, res) => {
    const { roomCode } = req.params;

    try {
        const [results] = await db.query(`
            SELECT COUNT(*) AS notReady 
            FROM RoomParticipants 
            WHERE RoomID = (SELECT RoomID FROM Rooms WHERE RoomCode = ?) 
            AND isReady = FALSE`, 
            [roomCode]
        );

        const allReady = results[0].notReady === 0;
        res.json({ allReady });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt", error });
    }
});

// Frissíti egy felhasználó "készen állok" státuszát és értesíti a többi klienst
router.post('/rooms/ready', async (req, res) => {
    const { roomCode, userId, isReady } = req.body;

    if (!roomCode || !userId) {
        return res.status(400).json({ success: false, message: "Hiányzó adatok: roomCode vagy userId" });
    }

    try {
        const [roomResults] = await db.query(
            `SELECT RoomID FROM Rooms WHERE RoomCode = ?`,
            [roomCode]
        );

        if (roomResults.length === 0) {
            return res.status(404).json({ message: "Szoba nem található" });
        }

        const roomId = roomResults[0].RoomID;

        // ✅ Felhasználó készenléti állapotának frissítése
        await db.query(
            `UPDATE RoomParticipants SET isReady = ? WHERE RoomID = ? AND UserID = ?`,
            [isReady, roomId, userId]
        );

        // ✅ Ellenőrzés, hogy mindenki készen áll-e
        const [readyResults] = await db.query(
            `SELECT COUNT(*) AS notReady FROM RoomParticipants WHERE RoomID = ? AND isReady = FALSE`,
            [roomId]
        );

        const allReady = readyResults[0].notReady === 0;

        // 🔥 Küldjünk frissítést a szobában lévő minden felhasználónak
        req.app.get('io').to(roomCode).emit('updateReadyStatus', allReady);

        res.json({ success: true, allReady });

    } catch (error) {
        console.error("❌ Hiba történt a készenléti állapot frissítésekor:", error);
        res.status(500).json({ message: "Belső szerverhiba", error: error.message });
    }
});


//meg fogom ölni magam
router.post('/ready', async (req, res) => {
    const { roomCode, userId, isReady } = req.body;

    console.log("🔍 [DEBUG] Érkezett kérés a /ready végpontra", req.body);

    if (!roomCode || !userId) {
        console.error("❌ [HIBA] Hiányzó adatok: roomCode vagy userId", req.body);
        return res.status(400).json({ success: false, message: "Hiányzó adatok: roomCode vagy userId" });
    }

    try {
        console.log(`📌 [DEBUG] Készenléti állapot frissítése: roomCode=${roomCode}, userId=${userId}, isReady=${isReady}`);

        // Szoba keresése
        const [roomResults] = await db.query(
            `SELECT RoomID FROM Rooms WHERE RoomCode = ?`,
            [roomCode]
        );

        if (roomResults.length === 0) {
            console.error("❌ [HIBA] Szoba nem található!", roomCode);
            return res.status(404).json({ success: false, message: "Szoba nem található" });
        }

        const roomId = roomResults[0].RoomID;
        console.log(`✅ [DEBUG] Szoba ID megtalálva: ${roomId}`);

        // Felhasználó keresése a szobában
        const [userCheck] = await db.query(
            `SELECT * FROM RoomParticipants WHERE RoomID = ? AND UserID = ?`,
            [roomId, userId]
        );

        if (userCheck.length === 0) {
            console.error("❌ [HIBA] A felhasználó nincs a szobában!", userId);
            return res.status(404).json({ success: false, message: "A felhasználó nem található ebben a szobában." });
        }

        console.log(`✅ [DEBUG] Felhasználó megtalálva a szobában: ${userId}`);

        // Készenléti állapot frissítése az adatbázisban
        const [updateResult] = await db.query(
            `UPDATE RoomParticipants SET isReady = ? WHERE RoomID = ? AND UserID = ?`,
            [isReady, roomId, userId]
        );

        console.log(`🔄 [DEBUG] DB Update Result:`, updateResult);

        // Ellenőrizzük, hogy mindenki készen áll-e
        const [readyResults] = await db.query(
            `SELECT COUNT(*) AS notReady FROM RoomParticipants WHERE RoomID = ? AND isReady = FALSE`,
            [roomId]
        );

        const allReady = readyResults[0].notReady === 0;
        console.log(`🔄 [DEBUG] Mindenki készen áll? ${allReady}`);

        // Küldjünk frissítést a frontendnek WebSocket-en
        req.app.get('io').to(roomCode).emit('updateReadyStatus', allReady);

        return res.json({ success: true, allReady });

    } catch (error) {
        console.error("🔥 [ERROR] Belső szerverhiba a készenléti állapot frissítésekor:", error);
        return res.status(500).json({ success: false, message: "Belső szerverhiba", error: error.message });
    }
});


module.exports = router;