const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/dbConfig"); // MySQL kapcsolat
const router = express.Router();

// 🔹 Middleware a token ellenőrzéséhez
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.planup_token || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    console.log("🔴 Nincs token! Felhasználó nincs bejelentkezve.");
    return res.json({ loggedIn: false });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      console.log("🔴 Érvénytelen token vagy lejárt!", err.message);
      return res.json({ loggedIn: false });
    }
    
    console.log(`✅ Token érvényes! Bejelentkezett felhasználó ID: ${decoded.userId}`);
    req.user = decoded;
    next();
  });
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await db.execute("SELECT UserID, PasswordHash, IsAdmin FROM Users WHERE Email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "A felhasználó nem található." });
    }
    
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Hibás jelszó!" });
    }
    
    // 🔹 JWT generálás admin státusszal
    const token = jwt.sign(
      { userId: user.UserID, isAdmin: user.IsAdmin },
      "jwt_secret_key",
      { expiresIn: "1h" }
    );
    
    res.cookie("planup_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: "Lax"
    });
    
    res.json({ message: "✅ Sikeres bejelentkezés!", userId: user.UserID, isAdmin: user.IsAdmin });
  } catch (error) {
    console.error("❌ Hiba a bejelentkezés során:", error);
    res.status(500).json({ error: "Szerverhiba történt." });
  }
});

// 🔹 Bejelentkezési állapot ellenőrzése
router.get("/status", authenticateToken, (req, res) => {
  console.log(`ℹ️ Bejelentkezési státusz lekérdezve. UserID: ${req.user.userId}`);
  res.json({ loggedIn: true, userId: req.user.userId, isAdmin: req.user.isAdmin === 1 || req.user.isAdmin === true });
});

// 🔹 Kijelentkezés API
router.post("/logout", (req, res) => {
  const token = req.cookies?.planup_token; // Ellenőrizzük, hogy van-e token
  
  if (!token) {
    console.log("🔴 Kijelentkezés sikertelen: Nincs token!");
    return res.json({ message: "❌ Nincs aktív bejelentkezés.", loggedIn: false });
  }
  
  res.clearCookie("planup_token", { httpOnly: true, secure: false });
  console.log("👋 Sikeres kijelentkezés!");
  res.json({ message: "✅ Sikeresen kijelentkeztél!", loggedIn: false });
});

// 🔹 Jelszóváltoztatás API
router.put("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "❌ Mindkét jelszó mező kitöltése kötelező!" });
  }
  
  try {
    const [userRows] = await db.execute(
      "SELECT PasswordHash FROM Users WHERE UserID = ?", [userId]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: "Felhasználó nem található!" });
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, userRows[0].PasswordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Hibás régi jelszó!" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE Users SET PasswordHash = ? WHERE UserID = ?", [hashedPassword, userId]);
    res.json({ message: "🔒 Jelszó sikeresen frissítve!" });
  } catch (error) {
    res.status(500).json({ error: "Szerverhiba történt!" });
  }
});

module.exports = router;
