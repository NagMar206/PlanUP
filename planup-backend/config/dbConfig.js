const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '10.3.1.65',
    user: 'mollev545',
    password: '72576822545',
    database: 'mollev545',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db; // 🔹 Ezt kell exportálni!
