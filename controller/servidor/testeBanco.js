const banco = require('./banco');

async function testarBanco() {
    try {
        const [resultado] = await banco.query('SELECT 1');

        console.log('Conexão com o banco funcionando!');
        console.log(resultado);
    } catch (erro) {
        console.error('Erro no teste:', erro);
    }
}

testarBanco();