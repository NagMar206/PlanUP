const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/dbConfig"); // MySQL kapcsolat
const router = express.Router();

// 🔹 Middleware a token ellenőrzéséhez
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

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



// 🔹 Bejelentkezési állapot ellenőrzése
router.get("/status", authenticateToken, (req, res) => {
    console.log(`ℹ️ Bejelentkezési státusz lekérdezve. UserID: ${req.user.userId}`);
    res.json({ loggedIn: true, userId: req.user.userId });
});

// 🔹 Kijelentkezés API
router.post("/logout", (req, res) => {
    console.log(`👋 Kijelentkezés történt. UserID: ${req.user ? req.user.userId : "Ismeretlen"}`);
    res.clearCookie("token", { httpOnly: true, secure: false });
    res.json({ message: "👋 Sikeres kijelentkezés!", loggedIn: false });
});

// 🔹 Jelszóváltoztatás API
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
