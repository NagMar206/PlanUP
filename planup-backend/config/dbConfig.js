const mysql = require('mysql2/promise');

//PlanUP Adatbázis
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
/*
//Iskolai szerver
const db = mysql.createPool({
    host: '10.3.1.65', // XAMPP esetén ez maradjon "localhost"
    user: 'mollev545', // XAMPP alapértelmezett felhasználó
    password: '72576822545', // XAMPP esetén nincs jelszó, hagyd üresen
    database: 'mollev545', // Az adatbázis neve (ellenőrizd phpMyAdminban!)
    port: 3306, // Ha a MySQL más porton fut, módosítsd
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
*/
module.exports = db;
