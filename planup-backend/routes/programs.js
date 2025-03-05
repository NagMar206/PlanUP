const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig'); // ✅ HELYES ÚTVONAL


// Programok lekérdezése
router.get('/', async (req, res) => {
  try {
    if (!req.db) {
      return res.status(500).json({ error: 'Nincs adatbázis kapcsolat.' });
    }
    const [program] = await db.execute('SELECT * FROM Programs ORDER BY RAND() LIMIT 1');
    res.status(200).json(programs);
  } catch (error) {
    console.error('Hiba történt a programok lekérdezése során:', error.message);
    res.status(500).json({ error: 'Hiba történt a programok lekérdezése során.' });
  }
});

// Véletlenszerű program lekérdezése
router.get('/random', async (req, res) => {
  try {
    console.log("🔍 Véletlenszerű program lekérése indul...");

    const [program] = await db.execute('SELECT * FROM Programs ORDER BY RAND() LIMIT 1');

    if (program.length === 0) {
      console.log("⚠️ Nincs több elérhető program.");
      return res.json(null);
    }

    console.log("🎯 Visszaküldött program:", program[0]);
    res.status(200).json(program[0]);

  } catch (error) {
    console.error('🔥 Hiba történt egy véletlenszerű program lekérdezése során:', error.message);
    res.status(500).json({ error: 'Hiba történt egy véletlenszerű program lekérdezése során.', details: error.message });
  }
});

router.post("/programs/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const programId = req.params.id;

    if (!userId || !programId) {
      return res.status(400).json({ error: "Hiányzó userId vagy programId." });
    }

    console.log(`👍 Like hozzáadása: UserID = ${userId}, ProgramID = ${programId}`);

    await db.execute(
      "INSERT INTO UserLikes (UserID, ProgramID) VALUES (?, ?) ON DUPLICATE KEY UPDATE ProgramID=ProgramID",
      [userId, programId]
    );

    res.status(200).json({ message: "Like sikeresen mentve!" });
  } catch (error) {
    console.error("🔥 Hiba történt a like mentésekor:", error);
    res.status(500).json({ error: "Szerverhiba a like mentésekor.", details: error.message });
  }
});

router.post("/programs/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const programId = req.params.id;

    if (!userId || !programId) {
      return res.status(400).json({ error: "Hiányzó userId vagy programId." });
    }

    console.log(`👎 Dislike hozzáadása: UserID = ${userId}, ProgramID = ${programId}`);

    await db.execute(
      "DELETE FROM UserLikes WHERE UserID = ? AND ProgramID = ?",
      [userId, programId]
    );

    res.status(200).json({ message: "Dislike sikeresen mentve!" });
  } catch (error) {
    console.error("🔥 Hiba történt a dislike mentésekor:", error);
    res.status(500).json({ error: "Szerverhiba a dislike mentésekor.", details: error.message });
  }
});


module.exports = router;
