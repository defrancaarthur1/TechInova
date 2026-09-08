const mysql = require('mysql2/promise');

const banco = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Amor1003*',
    database: 'adega_controle'
});

module.exports = banco;