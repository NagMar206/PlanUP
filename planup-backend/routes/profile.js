const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig"); // MySQL kapcsolat
const bcrypt = require("bcrypt");

// 🔹 1️⃣ Felhasználói adatok lekérése (GET)
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "UserID szükséges!" });
  }

  try {
    const [rows] = await db.execute("SELECT Username FROM Users WHERE UserID = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Felhasználó nem található!" });
    }

    res.json({ username: rows[0].Username });
  } catch (error) {
    console.error("❌ Hiba a profil lekérésekor:", error);
    res.status(500).json({ error: "Szerverhiba történt." });
  }
});

// 🔹 2️⃣ Név módosítása (PUT)
router.put("/update-name", async (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name.trim()) {
    return res.status(400).json({ error: "UserID és új név szükséges!" });
  }

  try {
    await db.execute("UPDATE Users SET Username = ? WHERE UserID = ?", [name, userId]);
    res.status(200).json({ message: "✅ Név sikeresen frissítve!" });
  } catch (error) {
    console.error("❌ Hiba a névváltoztatáskor:", error);
    res.status(500).json({ error: "Hiba történt a név frissítésekor." });
  }
});

// 🔹 3️⃣ Profil törlése (DELETE)
router.delete("/delete-profile", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "UserID szükséges!" });
  }

  try {
    await db.execute("DELETE FROM Users WHERE UserID = ?", [userId]);
    res.status(200).json({ message: "✅ A profil sikeresen törölve lett." });
  } catch (error) {
    console.error("❌ Hiba a profil törlésekor:", error);
    res.status(500).json({ error: "Szerverhiba történt a profil törlésekor." });
  }
});

module.exports = router;
