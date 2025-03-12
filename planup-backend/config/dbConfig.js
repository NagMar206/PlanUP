const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost', // XAMPP esetén ez maradjon "localhost"
    user: 'root', // XAMPP alapértelmezett felhasználó
    password: '', // XAMPP esetén nincs jelszó, hagyd üresen
    database: 'planup', // Az adatbázis neve (ellenőrizd phpMyAdminban!)
    port: 3307, // Ha a MySQL más porton fut, módosítsd
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
