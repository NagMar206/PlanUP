const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const [users] = await db.execute("SELECT UserID, Email, PasswordHash FROM Users WHERE Email = ?", [email]);
      if (users.length === 0) return done(null, false, { message: "Hibás bejelentkezési adatok!" });

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!passwordMatch) return done(null, false, { message: "Hibás jelszó!" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO Users (Email, PasswordHash) VALUES (?, ?)", [email, hashedPassword]);
    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (error) {
    res.status(500).json({ error: "Regisztráció sikertelen." });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info.message || "Bejelentkezési hiba!" });

    const token = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Sikeres bejelentkezés!", token });
  })(req, res, next);
});

router.get("/status", (req, res) => {
  if (!req.user) return res.status(401).json({ loggedIn: false });
  res.json({ loggedIn: true, user: req.user });
});

module.exports = router;
