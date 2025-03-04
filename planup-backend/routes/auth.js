const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware a token ellenőrzéséhez
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.json({ loggedIn: false });
    }

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {const express = require('express');
            const jwt = require('jsonwebtoken');
            
            const router = express.Router();
            
            // Middleware a token ellenőrzéséhez
            const authenticateToken = (req, res, next) => {
                const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
            
                if (!token) {
                    return res.json({ loggedIn: false });
                }
            
                jwt.verify(token, 'secret_key', (err, user) => {
                    if (err) {
                        return res.json({ loggedIn: false });
                    }
                    req.user = user;
                    next();
                });
            };
            
            // Bejelentkezési állapot ellenőrzése
            router.get('/status', authenticateToken, (req, res) => {
                res.json({ loggedIn: true, user: req.user });
            });
            
            // Kijelentkezés API
            router.post('/logout', (req, res) => {
                res.clearCookie('token');
                res.json({ message: "Sikeres kijelentkezés!" });
            });
            
            module.exports = router;
            
            return res.json({ loggedIn: false });
        }
        req.user = user;
        next();
    });
};


// Bejelentkezési állapot lekérdezése
router.get('/status', authenticateToken, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

module.exports = router;
