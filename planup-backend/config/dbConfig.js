const mysql = require('mysql2/promise');
/*
//PlanUP Adatbázis
 const db = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '', // lokális esetén nincs jelszó, hagyd üresen
    database: 'PlanUp', // Az adatbázis neve 
    port: 3307, // Ha a MySQL más porton fut, módosítsd
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}); 
*/
//Iskolai szerver
const db = mysql.createPool({
    host: '10.3.1.65', 
    user: 'mollev545', // iskolai szerver alapértelmezett felhasználó
    password: '72576822545', // iskolai szerver jelszó
    database: 'mollev545', // Az adatbázis neve (ebben van a PlanUP)
    port: 3306, // Ha a MySQL más porton fut, módosítsd
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}); 

module.exports = db;
