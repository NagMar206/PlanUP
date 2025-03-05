const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'PlanUp',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db; // 🔹 Ezt kell exportálni!
