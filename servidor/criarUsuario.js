const bcrypt = require('bcrypt');
const banco = require('./banco');

async function alterarSenha() {
    try {
        const email = 'admin@adega.com';
        const novaSenha = 'Adega2026';
        const nome = 'Administrador';
        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

        const [resultado] = await banco.execute(`
            INSERT IGNORE INTO usuarios (nome, email, senha, ativo)
            VALUES (?, ?, ?, TRUE)
        `, [nome, email, senhaCriptografada]);

        if (resultado.affectedRows === 1) {
            console.log('Administrador inicial criado com sucesso.');
            console.log('E-mail: admin@adega.com');
            console.log('Senha inicial: Adega2026');
        } else {
            console.log('O administrador já existe; a senha não foi alterada.');
        }

    } catch (erro) {
        console.error('Erro ao alterar senha:', erro);
        process.exitCode = 1;
    } finally {
        await banco.end();
    }
}

alterarSenha();