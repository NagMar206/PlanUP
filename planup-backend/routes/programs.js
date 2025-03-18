const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig'); // Ensure this path is correct
if (!db) {
  console.error('Nincs adatbázis kapcsolat.');
  return res.status(500).json({ error: 'Nincs adatbázis kapcsolat.' });
}

// Programok lekérdezése
router.get('/', async (req, res) => {
  try {
    const [program] = await db.execute(`
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      ORDER BY RAND() 
      LIMIT 1
  `);
      res.status(200).json(program); // Use 'program' instead of 'programs'
  } catch (error) {
    console.error('Hiba történt a programok lekérdezése során:', error.message);
    res.status(500).json({ error: 'Hiba történt a programok lekérdezése során.' });
  }
});



// Véletlenszerű program lekérdezése
router.get('/random', async (req, res) => {
  try {
    console.log("🔍 Véletlenszerű program lekérése indul...");

    const [program] = await db.execute(`
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      ORDER BY RAND() 
      LIMIT 1
  `);
  
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
router.get('/liked', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Hiányzó userId paraméter." });
    }

    console.log(`🔍 Kedvelt programok lekérése UserID = ${userId}`);

    const [likedPrograms] = await db.execute(`
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      JOIN UserLikes ul ON p.ProgramID = ul.ProgramID
      WHERE ul.UserID = ?;
    `, [userId]);

    console.log("✅ Kedvelt programok listája:", likedPrograms);
    res.status(200).json(likedPrograms);

  } catch (error) {
    console.error("🔥 Hiba történt a kedvelt programok lekérdezése során:", error);
    res.status(500).json({ error: "Hiba történt a kedvelt programok lekérdezése során.", details: error.message });
  }
});


module.exports = router;
