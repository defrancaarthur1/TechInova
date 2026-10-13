const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mysql = require('mysql2/promise');

const configuracaoObrigatoria = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const configuracaoAusente = configuracaoObrigatoria.filter(
    (chave) => !process.env[chave]
);

if (configuracaoAusente.length > 0) {
    throw new Error(
        `Configure ${configuracaoAusente.join(', ')} no arquivo servidor/.env. ` +
        'Use servidor/.env.example como modelo.'
    );
}

const banco = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306)
});

module.exports = banco;