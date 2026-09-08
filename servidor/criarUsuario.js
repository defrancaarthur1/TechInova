const bcrypt = require('bcrypt');
const banco = require('./banco');

async function criarUsuario() {
    try {
        const nome = 'Administrador';
        const email = 'admin@adega.com';
        const senha = '123456';

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        banco.query(
            sql,
            [nome, email, senhaCriptografada],
            (erro, resultado) => {
                if (erro) {
                    console.error('Erro ao criar usuário:', erro);
                    return;
                }

                console.log('Usuário criado com sucesso!');
                console.log('ID:', resultado.insertId);
                console.log('E-mail:', email);
                console.log('Senha:', senha);

                banco.end();
            }
        );

    } catch (erro) {
        console.error('Erro:', erro);
    }
}

criarUsuario();