const bcrypt = require('bcrypt');
const banco = require('./banco');

async function alterarSenha() {
    try {

        const email = 'admin@adega.com';
        const novaSenha = 'Adega2026';

        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

        const [resultado] = await banco.query(`
            UPDATE usuarios
            SET senha = ?
            WHERE email = ? `, [senhaCriptografada, email]);

        if (resultado.affectedRows === 0) {
            console.log('Usuário não encontrado.');

        } else {
            console.log('Senha alterada com sucesso!');
            console.log('E-mail:', email);
            console.log('Nova senha:', novaSenha);
        }

        await banco.end();

    } catch (erro) {
        console.error('Erro ao alterar senha:', erro);
    }
}

alterarSenha();