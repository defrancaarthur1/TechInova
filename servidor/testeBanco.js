const banco = require('./banco');

banco.query('SELECT DATABASE() AS banco', (erro, resultado) => {

    if (erro) {
        console.error('Erro no teste:', erro.message);
        return;
    }

    console.log('Banco conectado:', resultado[0].banco);

    banco.end();
});