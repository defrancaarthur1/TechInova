
const banco = require('../banco');

// Obter conexão para operações transacionais
async function obterConexao() {
    return await banco.getConnection();
}

// Registrar compra
async function criarCompra(conexao, fornecedor_id, data_compra, valor_total) {
    const [resultado] = await conexao.query(
        `INSERT INTO compras
        (fornecedor_id, data_compra, valor_total, estoque_contabilizado)
        VALUES (?, ?, ?, 1)`,
        [fornecedor_id, data_compra, valor_total]
    );

    return resultado;
}

// Listar todas as compras
async function listarTodas() {
    const [compras] = await banco.query(`
        SELECT
            c.id AS compra_id,
            c.fornecedor_id,
            c.data_compra,
            c.valor_total,
            f.empresa AS fornecedor
        FROM compras c
        INNER JOIN fornecedores f ON c.fornecedor_id = f.id
        ORDER BY c.data_compra DESC
    `);

    for (const compra of compras) {
        const [itens] = await banco.query(`
            SELECT
                ic.id AS item_id,
                ic.produto_id,
                p.nome AS produto,
                ic.quantidade,
                ic.valor_unitario,
                ic.subtotal
            FROM itens_compra ic
            INNER JOIN produtos p ON ic.produto_id = p.id
            WHERE ic.compra_id = ?
        `, [compra.compra_id]);

        compra.itens = itens;
    }

    return compras;
}

// Buscar compra pelo ID
async function buscarPorId(id) {
    const [compras] = await banco.query(`
        SELECT
            c.id AS compra_id,
            c.fornecedor_id,
            c.data_compra,
            c.valor_total,
            f.empresa AS fornecedor
        FROM compras c
        INNER JOIN fornecedores f ON c.fornecedor_id = f.id
        WHERE c.id = ?
    `, [id]);

    if (compras.length === 0) {
        return null;
    }

    const compra = compras[0];

    const [itens] = await banco.query(`
        SELECT
            ic.id AS item_id,
            ic.produto_id,
            p.nome AS produto,
            ic.quantidade,
            ic.valor_unitario,
            ic.subtotal
        FROM itens_compra ic
        INNER JOIN produtos p ON ic.produto_id = p.id
        WHERE ic.compra_id = ?
        ORDER BY ic.id
    `, [id]);

    compra.itens = itens;

    return compra;
}

// Inserir item da compra
async function inserirItem(conexao, compra_id, item) {
    const quantidade = Number(item.quantidade);
    const valor_unitario = Number(item.valor_unitario);
    const subtotal = quantidade * valor_unitario;

    const [resultado] = await conexao.query(`
        INSERT INTO itens_compra
        (compra_id, produto_id, quantidade, valor_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
    `, [
        compra_id,
        item.produto_id,
        quantidade,
        valor_unitario,
        subtotal
    ]);

    return resultado;
}

// Atualizar estoque
async function movimentarEstoque(conexao, produtoId, diferenca) {
    const [resultado] = await conexao.query(
        `UPDATE produtos
         SET estoque = estoque + ?
         WHERE id = ? AND estoque + ? >= 0`,
        [diferenca, produtoId, diferenca]
    );

    if (resultado.affectedRows !== 1) {
        const erro = new Error(
            'Produto inexistente ou estoque insuficiente para reverter a compra.'
        );

        erro.status = 409;
        throw erro;
    }
}

// Registrar entradas no estoque
async function registrarEntradas(conexao, compraId, itens) {
    for (const item of itens) {
        const quantidade = Number(item.quantidade);

        await movimentarEstoque(
            conexao,
            item.produto_id,
            quantidade
        );

        await conexao.query(
            `INSERT INTO movimentacoes_estoque
            (compra_id, produto_id, tipo, quantidade)
            VALUES (?, ?, 'ENTRADA', ?)`,
            [compraId, item.produto_id, quantidade]
        );
    }
}

// Buscar itens antigos e reverter estoque
async function reverterItens(conexao, compraId) {
    const [itens] = await conexao.query(
        `SELECT produto_id, quantidade
         FROM itens_compra
         WHERE compra_id = ?
         ORDER BY produto_id`,
        [compraId]
    );

    for (const item of itens) {
        await movimentarEstoque(
            conexao,
            item.produto_id,
            -Number(item.quantidade)
        );
    }
}

// Remover movimentações de uma compra
async function removerMovimentacoes(conexao, compraId) {
    await conexao.query(
        'DELETE FROM movimentacoes_estoque WHERE compra_id = ?',
        [compraId]
    );
}

// Verificar situação do estoque da compra
async function buscarSituacaoEstoque(conexao, id) {
    const [resultado] = await conexao.query(
        `SELECT estoque_contabilizado
         FROM compras
         WHERE id = ?
         FOR UPDATE`,
        [id]
    );

    return resultado[0] || null;
}

// Atualizar dados principais da compra
async function atualizarCompra(conexao, id, fornecedor_id, data_compra, valor_total) {
    const [resultado] = await conexao.query(
        `UPDATE compras
         SET fornecedor_id = ?,
             data_compra = ?,
             valor_total = ?
         WHERE id = ?`,
        [fornecedor_id, data_compra, valor_total, id]
    );

    return resultado;
}

// Excluir itens antigos
async function excluirItens(conexao, compraId) {
    await conexao.query(
        'DELETE FROM itens_compra WHERE compra_id = ?',
        [compraId]
    );
}

// Excluir compra
async function excluirCompra(conexao, id) {
    const [resultado] = await conexao.query(
        'DELETE FROM compras WHERE id = ?',
        [id]
    );

    return resultado;
}

module.exports = {
    obterConexao,
    criarCompra,
    listarTodas,
    buscarPorId,
    inserirItem,
    movimentarEstoque,
    registrarEntradas,
    reverterItens,
    removerMovimentacoes,
    buscarSituacaoEstoque,
    atualizarCompra,
    excluirItens,
    excluirCompra
};
