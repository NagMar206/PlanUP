const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig"); // Ensure this path is correct

if (!db) {
  console.error("Nincs adatbázis kapcsolat.");
  return res.status(500).json({ error: "Nincs adatbázis kapcsolat." });
}

// Programok lekérdezése
router.get("/", async (req, res) => {
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
    console.error("Hiba történt a programok lekérdezése során:", error.message);
    res
      .status(500)
      .json({ error: "Hiba történt a programok lekérdezése során." });
  }
});
// Városok lekérdezése
// Városok lekérdezése
router.get("/cities", async (req, res) => {
  try {
    const [cities] = await db.execute(`
      SELECT CityID, Name 
      FROM City 
      ORDER BY Name
    `);

    console.log("🏙️ Városok lekérdezve:", cities.length);
    res.status(200).json(cities);
  } catch (error) {
    console.error(
      "🔥 Hiba történt a városok lekérdezése során:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Hiba történt a városok lekérdezése során." });
  }
});

// Véletlenszerű program lekérdezése
// Véletlenszerű program lekérdezése
router.get("/random", async (req, res) => {
  try {
    console.log("🔍 Véletlenszerű program lekérése indul...");

    // Szűrési paraméterek feldolgozása
    const { duration, cost, city } = req.query;

    // Alap lekérdezés
    let query = `
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      WHERE 1=1
    `;

    const params = [];

    // Szűrési feltételek hozzáadása
    if (duration) {
      let durationValue;
      if (duration === "half_day") durationValue = 1;
      else if (duration === "whole_day") durationValue = 2;
      else if (duration === "weekend") durationValue = 3;

      if (durationValue) {
        query += ` AND p.Duration = ?`;
        params.push(durationValue);
      }
    }

    if (cost) {
      query += ` AND p.Cost = ?`;
      params.push(cost === "paid" ? 1 : 0);
    }

    // Város szűrő hozzáadása
    if (city) {
      query += ` AND p.CityID = ?`;
      params.push(city);
    }

    // Véletlenszerű sorrend és limit
    query += ` ORDER BY RAND() LIMIT 1`;

    console.log("🔍 SQL lekérdezés:", query, "Paraméterek:", params);

    const [programs] = await db.execute(query, params);

    if (programs.length === 0) {
      console.log("⚠️ Nincs több elérhető program.");
      return res.json(null);
    }

    console.log("🎯 Visszaküldött program:", programs[0]);
    res.status(200).json(programs[0]);
  } catch (error) {
    console.error(
      "🔥 Hiba történt egy véletlenszerű program lekérdezése során:",
      error.message
    );
    res
      .status(500)
      .json({
        error: "Hiba történt egy véletlenszerű program lekérdezése során.",
        details: error.message,
      });
  }
});

router.post("/programs/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const programId = req.params.id;

    if (!userId || !programId) {
      return res.status(400).json({ error: "Hiányzó userId vagy programId." });
    }

    console.log(
      `👍 Like hozzáadása: UserID = ${userId}, ProgramID = ${programId}`
    );

    await db.execute(
      "INSERT INTO UserLikes (UserID, ProgramID) VALUES (?, ?) ON DUPLICATE KEY UPDATE ProgramID=ProgramID",
      [userId, programId]
    );

    res.status(200).json({ message: "Like sikeresen mentve!" });
  } catch (error) {
    console.error("🔥 Hiba történt a like mentésekor:", error);
    res
      .status(500)
      .json({
        error: "Szerverhiba a like mentésekor.",
        details: error.message,
      });
  }
});

router.post("/programs/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const programId = req.params.id;

    if (!userId || !programId) {
      return res.status(400).json({ error: "Hiányzó userId vagy programId." });
    }

    console.log(
      `👎 Dislike hozzáadása: UserID = ${userId}, ProgramID = ${programId}`
    );

    await db.execute(
      "DELETE FROM UserLikes WHERE UserID = ? AND ProgramID = ?",
      [userId, programId]
    );

    res.status(200).json({ message: "Dislike sikeresen mentve!" });
  } catch (error) {
    console.error("🔥 Hiba történt a dislike mentésekor:", error);
    res
      .status(500)
      .json({
        error: "Szerverhiba a dislike mentésekor.",
        details: error.message,
      });
  }
});

router.get("/liked", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Hiányzó userId paraméter." });
    }

    console.log(`🔍 Kedvelt programok lekérése UserID = ${userId}`);

    const [likedPrograms] = await db.execute(
      `
      SELECT p.*, c.Name AS CityName
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      JOIN UserLikes ul ON p.ProgramID = ul.ProgramID
      WHERE ul.UserID = ?;
    `,
      [userId]
    );

    console.log("✅ Kedvelt programok listája:", likedPrograms);
    res.status(200).json(likedPrograms);
  } catch (error) {
    console.error(
      "🔥 Hiba történt a kedvelt programok lekérdezése során:",
      error
    );
    res
      .status(500)
      .json({
        error: "Hiba történt a kedvelt programok lekérdezése során.",
        details: error.message,
      });
  }
});

router.get("/cities/with-programs", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DISTINCT c.CityID, c.Name
      FROM Programs p
      JOIN City c ON p.CityID = c.CityID
      ORDER BY c.Name ASC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("⚠️ Hiba a városok lekérdezésekor:", error.message);
    res.status(500).json({ error: "Hiba történt a városok lekérdezése során." });
  }
});


module.exports = router;
