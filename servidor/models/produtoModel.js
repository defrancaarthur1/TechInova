
const banco = require('../banco');

// Verificar se já existe um produto com os mesmos dados
async function buscarDuplicado(nome, categoria, unidade, idExcluir = null) {
    let sql = `
        SELECT id
        FROM produtos
        WHERE LOWER(TRIM(nome)) = LOWER(?)
          AND LOWER(TRIM(categoria)) = LOWER(?)
          AND LOWER(TRIM(unidade)) = LOWER(?)
    `;

    const parametros = [nome, categoria, unidade];

    if (idExcluir !== null) {
        sql += ' AND id <> ?';
        parametros.push(idExcluir);
    }

    sql += ' LIMIT 1';

    const [resultado] = await banco.query(sql, parametros);
    return resultado;
}

// Cadastrar produto
async function criar(nome, categoria, unidade) {
    const [resultado] = await banco.query(
        `INSERT INTO produtos (nome, categoria, unidade)
         VALUES (?, ?, ?)`,
        [nome, categoria, unidade]
    );

    return resultado;
}

// Listar produtos
async function listarTodos() {
    const [resultado] = await banco.query(
        `SELECT id, nome, categoria, unidade, estoque
         FROM produtos
         ORDER BY nome ASC`
    );

    return resultado;
}

// Buscar produto pelo ID
async function buscarPorId(id) {
    const [resultado] = await banco.query(
        `SELECT id, nome, categoria, unidade, estoque
         FROM produtos
         WHERE id = ?`,
        [id]
    );

    return resultado;
}

// Atualizar produto
async function atualizar(id, nome, categoria, unidade) {
    const [resultado] = await banco.query(
        `UPDATE produtos
         SET nome = ?, categoria = ?, unidade = ?
         WHERE id = ?`,
        [nome, categoria, unidade, id]
    );

    return resultado;
}

// Verificar vínculos com compras e movimentações
async function contarVinculos(id) {
    const [resultado] = await banco.query(
        `SELECT
            (SELECT COUNT(*) FROM itens_compra WHERE produto_id = ?) AS itens,
            (SELECT COUNT(*) FROM movimentacoes_estoque WHERE produto_id = ?) AS movimentacoes`,
        [id, id]
    );

    return resultado[0];
}

// Excluir produto
async function excluir(id) {
    const [resultado] = await banco.query(
        `DELETE FROM produtos WHERE id = ?`,
        [id]
    );

    return resultado;
}

module.exports = {
    buscarDuplicado,
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    contarVinculos,
    excluir
};
