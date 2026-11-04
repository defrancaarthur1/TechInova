require('dotenv').config({
    path: __dirname + '/.env'
});

const mysql = require('mysql2/promise');


// =====================================================
// CONFIGURAÇÃO DO POOL DE CONEXÕES
// =====================================================

const banco = mysql.createPool({

    host:
        process.env.DB_HOST,

    user:
        process.env.DB_USER,

    password:
        process.env.DB_PASSWORD,

    database:
        process.env.DB_NAME,

    port:
        Number(process.env.DB_PORT || 3306),

    // Aguarda uma conexão ficar disponível
    waitForConnections:
        true,

    // Quantidade máxima de conexões simultâneas
    connectionLimit:
        10,

    // Sem limite de requisições aguardando conexão
    queueLimit:
        0

});


// =====================================================
// TESTE DE CONEXÃO
// =====================================================
//
// Não encerra o servidor se o MySQL estiver
// temporariamente indisponível.
// Apenas registra o problema no terminal.
// =====================================================

async function testarConexao() {

    try {

        const conexao =
            await banco.getConnection();

        console.log(
            'MySQL conectado com sucesso.'
        );

        conexao.release();

    } catch (erro) {

        console.error(
            '========================================'
        );

        console.error(
            'ERRO AO CONECTAR AO MYSQL'
        );

        console.error(
            'Código:',
            erro.code
        );

        console.error(
            'Mensagem:',
            erro.message
        );

        console.error(
            '========================================'
        );

    }

}


testarConexao();


module.exports = banco;
