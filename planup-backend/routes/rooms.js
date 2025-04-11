const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

// Szoba létrehozása
router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(400).json({ error: "Felhasználói azonosító szükséges!" });

  try {
    const roomCode = uuidv4().substring(0, 8).toUpperCase();
    await db.execute(
      "INSERT INTO Rooms (RoomCode, CreatedByUserID) VALUES (?, ?)",
      [roomCode, userId]
    );

    const [roomData] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    const roomId = roomData[0].RoomID;
    await db.execute(
      "INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)",
      [roomId, userId]
    );

    req.session.roomCode = roomCode;
    req.session.userId = userId;
    req.session.createdAt = Date.now();

    res.status(200).json({ message: "Szoba létrehozva!", roomCode });
  } catch (error) {
    console.error("Hiba szobalétrehozáskor:", error);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// Szobához csatlakozás
router.post("/join", async (req, res) => {
  const { roomCode, userId } = req.body;
  if (!roomCode || !userId)
    return res.status(400).json({ error: "Hiányzó paraméter" });

  try {
    const [room] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0)
      return res.status(404).json({ error: "Szoba nem található" });

    const roomId = room[0].RoomID;
    const [already] = await db.execute(
      "SELECT * FROM RoomParticipants WHERE RoomID = ? AND UserID = ?",
      [roomId, userId]
    );
    if (already.length === 0) {
      await db.execute(
        "INSERT INTO RoomParticipants (RoomID, UserID) VALUES (?, ?)",
        [roomId, userId]
      );
    }

    req.session.roomCode = roomCode;
    req.session.userId = userId;
    req.session.createdAt = Date.now();

    res.status(200).json({ message: "Csatlakozás sikeres", roomCode });
  } catch (error) {
    console.error("Hiba a csatlakozás során:", error);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// Aktuális szoba lekérése
router.get("/current", (req, res) => {
  if (req.session.roomCode && Date.now() - req.session.createdAt < 7200000) {
    return res.status(200).json({ roomCode: req.session.roomCode });
  }
  res.status(404).json({ error: "Nincs aktív szoba" });
});

// Kilépés szobából
router.post("/leave", async (req, res) => {
  const { userId, roomCode } = req.body;
  if (!userId || !roomCode)
    return res.status(400).json({ error: "Hiányzó paraméter" });

  try {
    const [room] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0)
      return res.status(404).json({ error: "Szoba nem található" });

    const roomId = room[0].RoomID;
    await db.execute(
      "DELETE FROM RoomParticipants WHERE RoomID = ? AND UserID = ?",
      [roomId, userId]
    );

    req.session.roomCode = null;
    req.session.userId = null;

    res.status(200).json({ message: "Kiléptél a szobából" });
  } catch (error) {
    console.error("Kilépési hiba:", error);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// Szobában lévő felhasználók lekérése
router.get("/:roomCode/users", async (req, res) => {
  const { roomCode } = req.params;
  try {
    const [room] = await db.execute(
      "SELECT RoomID, CreatedByUserID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0)
      return res.status(404).json({ error: "Szoba nem található" });

    const roomId = room[0].RoomID;
    const creatorId = room[0].CreatedByUserID;
    const [creatorData] = await db.execute(
      "SELECT Username FROM Users WHERE UserID = ?",
      [creatorId]
    );
    const [users] = await db.execute(
      `
      SELECT u.Username FROM RoomParticipants rp
      JOIN Users u ON rp.UserID = u.UserID
      WHERE rp.RoomID = ?
    `,
      [roomId]
    );

    res
      .status(200)
      .json({ users, creator: creatorData[0]?.Username || "Ismeretlen" });
  } catch (err) {
    console.error("Hiba a felhasználók lekérésekor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// 🔹 RoomSwipe like mentés
router.post("/roomswipe/:roomCode/like", async (req, res) => {
  const { roomCode } = req.params;
  const { userId, programId } = req.body;
  if (!userId || !programId || !roomCode)
    return res.status(400).json({ error: "Hiányzó adat." });

  try {
    const [room] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0)
      return res.status(404).json({ error: "Szoba nem található." });

    const roomId = room[0].RoomID;

    await db.execute(
      "INSERT IGNORE INTO RoomSwipeLikes (RoomID, UserID, ProgramID) VALUES (?, ?, ?)",
      [roomId, userId, programId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("RoomSwipe mentési hiba:", error);
    res.status(500).json({ error: "Szerverhiba mentés közben." });
  }
});

// 🔹 RoomSwipe összegzés
router.get("/roomswipe/:roomCode/summary", async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [room] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0)
      return res.status(404).json({ error: "Szoba nem található." });

    const roomId = room[0].RoomID;

    const [summary] = await db.execute(
      `
      SELECT p.*, COUNT(r.UserID) AS likeCount
      FROM RoomSwipeLikes r
      JOIN Programs p ON r.ProgramID = p.ProgramID
      WHERE r.RoomID = ?
      GROUP BY r.ProgramID
      ORDER BY likeCount DESC
    `,
      [roomId]
    );

    res.json(summary);
  } catch (error) {
    console.error("RoomSwipe összegzési hiba:", error);
    res.status(500).json({ error: "Szerverhiba összegzés közben." });
  }
});

// ÚJ API a rooms.js-ben
router.get("/:roomCode/creatorId", async (req, res) => {
  const { roomCode } = req.params;
  try {
    const [room] = await db.execute(
      "SELECT CreatedByUserID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (!room.length) {
      return res.status(404).json({ error: "Szoba nem található." });
    }
    res.json({ creatorId: room[0].CreatedByUserID });
  } catch (err) {
    res.status(500).json({ error: "Hiba a létrehozó lekérdezésekor." });
  }
});

router.get("/:roomCode/liked-programs", async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [room] = await db.query(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (room.length === 0) {
      return res.status(404).json({ message: "A szoba nem található" });
    }

    const roomId = room[0].RoomID;

    const [programs] = await db.query(
      `
      SELECT 
        p.ProgramID,
        p.Name,
        p.Description,
        c.Name AS CityName,
        p.Location,
        p.Image,
        p.Duration,
        p.Cost,
        COUNT(rsl.UserID) AS likeCount
      FROM RoomSwipeLikes rsl
      JOIN Programs p ON rsl.ProgramID = p.ProgramID
      LEFT JOIN City c ON p.CityID = c.CityID
      WHERE rsl.RoomID = ?
      GROUP BY p.ProgramID
      ORDER BY likeCount DESC
    `,
      [roomId]
    );

    res.json(programs);
  } catch (err) {
    console.error("Hiba a liked-programs lekérdezésnél:", err);
    res
      .status(500)
      .json({ message: "Nem sikerült betölteni a kedvelt programokat." });
  }
});

router.post("/summary/choose", async (req, res) => {
  const { roomCode, userId, programId } = req.body;

  try {
    const [roomResult] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );
    if (roomResult.length === 0) {
      return res.status(404).json({ message: "A szoba nem található" });
    }
    const roomId = roomResult[0].RoomID;

    await db.execute(
      `
      INSERT INTO RoomSwipeLikes (RoomID, UserID, ProgramID, LikedAt)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE LikedAt = NOW()
    `,
      [roomId, userId, programId]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Mentési hiba:", err);
    res
      .status(500)
      .json({ message: "Hiba a lájk mentésekor", error: err.message });
  }
});

router.get("/getRoomId", async (req, res) => {
  const { roomCode } = req.query;

  if (!roomCode) {
    return res.status(400).json({ error: "Hiányzó roomCode paraméter!" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT RoomID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "A szoba nem található." });
    }

    res.json({ RoomID: rows[0].RoomID });
  } catch (error) {
    console.error("Hiba a RoomID lekérdezésekor:", error.message);
    res.status(500).json({ error: "Szerverhiba történt." });
  }
});

router.get("/:roomCode/programs", async (req, res) => {
  const { roomCode } = req.params;

  try {
    const [roomRows] = await db.execute(
      "SELECT RoomID, Filters FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: "A szoba nem található." });
    }

    let filters = {};
    try {
      const raw = roomRows[0].Filters;
      filters =
        raw && typeof raw === "string" && raw.trim().startsWith("{")
          ? JSON.parse(raw)
          : {};
    } catch (parseError) {
      console.warn("Szűrők nem parse-olhatók:", parseError.message);
      filters = {};
    }

    console.log("📦 Szűrési feltételek:", filters);

    let query = `
      SELECT p.*, c.Name AS CityName 
      FROM Programs p
      LEFT JOIN City c ON p.CityID = c.CityID
      WHERE 1 = 1
    `;
    const params = [];

    if (filters.city) {
      query += " AND p.CityID = ?";
      params.push(parseInt(filters.city));
    }

    if (filters.duration) {
      query += " AND p.Duration = ?";
      params.push(parseInt(filters.duration));
    }

    if (filters.cost) {
      query += " AND p.Cost = ?";
      params.push(filters.cost === "paid" ? 1 : 0);
    }

    console.log("📋 SQL:", query);
    console.log("🧪 Params:", params);

    const [programs] = await db.execute(query, params);
    res.json(programs);
  } catch (error) {
    console.error("Hiba a szobás programok lekérdezésekor:", error);
    res.status(500).json({
      error: "Hiba történt a szobához tartozó programok lekérdezésekor.",
    });
  }
});

router.post("/:roomCode/filters", async (req, res) => {
  const { roomCode } = req.params;
  const { duration, cost, city, userId } = req.body;

  const filters = { duration, cost, city };

  try {
    const [roomRows] = await db.execute(
      "SELECT CreatedByUserID FROM Rooms WHERE RoomCode = ?",
      [roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: "Szoba nem található." });
    }

    const creatorUserId = roomRows[0].CreatedByUserID;

    if (creatorUserId !== userId) {
      return res
        .status(403)
        .json({ error: "Csak a szoba létrehozója állíthatja a szűrőket." });
    }

    await db.execute("UPDATE Rooms SET Filters = ? WHERE RoomCode = ?", [
      JSON.stringify(filters),
      roomCode,
    ]);

    res.json({ message: "Szűrők sikeresen frissítve." });
  } catch (error) {
    console.error("Hiba a szűrők mentésekor:", error);
    res.status(500).json({ error: "Hiba a szűrők frissítése közben." });
  }
});

module.exports = router;
