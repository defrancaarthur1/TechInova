const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Saopaulo1324",
    database: "sistema_compras"
});

conexao.connect((erro) => {

    if (erro) {
        console.error("Erro ao conectar com o banco:", erro);
        return;
    }

    console.log("Banco de dados conectado com sucesso!");
});

module.exports = conexao;