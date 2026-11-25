
const banco = require('../banco');

// Buscar fornecedor pelo CNPJ
async function buscarPorCnpj(cnpj) {
    const [resultado] = await banco.query(
        `SELECT id
         FROM fornecedores
         WHERE CNPJ = ?
         LIMIT 1`,
        [cnpj]
    );

    return resultado;
}

// Buscar CNPJ de outro fornecedor durante a edição
async function buscarPorCnpjNaEdicao(cnpj, id) {
    const [resultado] = await banco.query(
        `SELECT id
         FROM fornecedores
         WHERE CNPJ = ?
         AND id <> ?
         LIMIT 1`,
        [cnpj, id]
    );

    return resultado;
}

// Cadastrar fornecedor
async function criar(dados) {
    const [resultado] = await banco.query(
        `INSERT INTO fornecedores
        (empresa, CNPJ, telefone, consultor, email, data_cadastro)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            dados.empresa,
            dados.cnpj,
            dados.telefone,
            dados.consultor,
            dados.email,
            dados.data_cadastro
        ]
    );

    return resultado;
}

// Listar fornecedores
async function listarTodos() {
    const [resultado] = await banco.query(
        `SELECT *
         FROM fornecedores
         ORDER BY empresa ASC`
    );

    return resultado;
}

// Buscar fornecedor pelo ID
async function buscarPorId(id) {
    const [resultado] = await banco.query(
        `SELECT *
         FROM fornecedores
         WHERE id = ?`,
        [id]
    );

    return resultado;
}

// Atualizar fornecedor
async function atualizar(id, dados) {
    const [resultado] = await banco.query(
        `UPDATE fornecedores
         SET empresa = ?,
             CNPJ = ?,
             telefone = ?,
             consultor = ?,
             email = ?,
             data_cadastro = ?
         WHERE id = ?`,
        [
            dados.empresa,
            dados.cnpj,
            dados.telefone,
            dados.consultor,
            dados.email,
            dados.data_cadastro,
            id
        ]
    );

    return resultado;
}

// Excluir fornecedor
async function excluir(id) {
    const [resultado] = await banco.query(
        `DELETE FROM fornecedores
         WHERE id = ?`,
        [id]
    );

    return resultado;
}

module.exports = {
    buscarPorCnpj,
    buscarPorCnpjNaEdicao,
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    excluir
};
