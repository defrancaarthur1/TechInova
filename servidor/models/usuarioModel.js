
const banco = require('../banco');

async function buscarPorId(id) {
    const [usuarios] = await banco.execute(
        'SELECT id, nome, email, senha FROM usuarios WHERE id = ? AND ativo = TRUE',
        [id]
    );

    return usuarios[0];
}

async function buscarPorEmail(email) {
    const [usuarios] = await banco.execute(
        'SELECT id, nome, email, senha FROM usuarios WHERE email = ? AND ativo = TRUE',
        [email]
    );

    return usuarios[0];
}

async function atualizarEmail(id, email) {
    return await banco.execute(
        'UPDATE usuarios SET email = ? WHERE id = ? AND ativo = TRUE',
        [email, id]
    );
}

async function atualizarSenha(id, senha) {
    return await banco.execute(
        'UPDATE usuarios SET senha = ? WHERE id = ? AND ativo = TRUE',
        [senha, id]
    );
}

module.exports = {
    buscarPorId,
    buscarPorEmail,
    atualizarEmail,
    atualizarSenha
};
