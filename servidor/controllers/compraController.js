
const compraModel = require('../models/compraModel');

// Validar os itens da compra
function validarItens(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        return 'Adicione pelo menos um produto à compra.';
    }

    for (const item of itens) {
        if (
            !Number.isSafeInteger(Number(item.produto_id)) ||
            Number(item.produto_id) <= 0
        ) {
            return 'Selecione um produto válido.';
        }

        if (
            !Number.isSafeInteger(Number(item.quantidade)) ||
            Number(item.quantidade) < 1 ||
            Number(item.quantidade) > 10000
        ) {
            return 'A quantidade deve ser um número inteiro entre 1 e 10000.';
        }

        if (
            item.valor_unitario === '' ||
            item.valor_unitario == null ||
            !Number.isFinite(Number(item.valor_unitario)) ||
            Number(item.valor_unitario) <= 0
        ) {
            return 'O valor unitário deve ser maior que zero.';
        }
    }

    return null;
}

// Calcular o valor total da compra
function calcularTotal(itens) {
    return itens.reduce((total, item) => {
        return total +
            Number(item.quantidade) * Number(item.valor_unitario);
    }, 0);
}

// Registrar compra
async function cadastrar(req, res) {
    const { fornecedor_id, data_compra, itens } = req.body;

    if (!fornecedor_id) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Selecione um fornecedor.'
        });
    }

    if (!data_compra) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe a data da compra.'
        });
    }

    const erroItens = validarItens(itens);

    if (erroItens) {
        return res.status(400).json({
            sucesso: false,
            mensagem: erroItens
        });
    }

    const valor_total = calcularTotal(itens);
    let conexao;

    try {
        conexao = await compraModel.obterConexao();
        await conexao.beginTransaction();

        const resultadoCompra = await compraModel.criarCompra(
            conexao,
            fornecedor_id,
            data_compra,
            valor_total
        );

        const compra_id = resultadoCompra.insertId;

        for (const item of itens) {
            await compraModel.inserirItem(conexao, compra_id, item);
        }

        await compraModel.registrarEntradas(conexao, compra_id, itens);
        await conexao.commit();

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Compra registrada com sucesso!',
            compra_id,
            valor_total
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error('Erro ao registrar compra:', erro);

        return res.status(erro.status || 500).json({
            sucesso: false,
            mensagem: erro.status
                ? erro.message
                : 'Erro ao registrar compra.'
        });

    } finally {
        if (conexao) conexao.release();
    }
}

// Listar compras
async function listar(req, res) {
    try {
        const compras = await compraModel.listarTodas();

        return res.json({
            sucesso: true,
            compras
        });

    } catch (erro) {
        console.error('Erro ao buscar compras:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar compras.'
        });
    }
}

// Buscar compra pelo ID
async function buscarPorId(req, res) {
    try {
        const compra = await compraModel.buscarPorId(req.params.id);

        if (!compra) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Compra não encontrada.'
            });
        }

        return res.json({
            sucesso: true,
            compra
        });

    } catch (erro) {
        console.error('Erro ao buscar compra:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar compra.'
        });
    }
}

// Excluir compra
async function excluir(req, res) {
    let conexao;

    try {
        conexao = await compraModel.obterConexao();
        await conexao.beginTransaction();

        const compra = await compraModel.buscarSituacaoEstoque(
            conexao,
            req.params.id
        );

        if (!compra) {
            await conexao.rollback();

            return res.status(404).json({
                sucesso: false,
                mensagem: 'Compra não encontrada.'
            });
        }

        if (Number(compra.estoque_contabilizado) === 1) {
            await compraModel.reverterItens(conexao, req.params.id);
        }

        await compraModel.removerMovimentacoes(conexao, req.params.id);
        await compraModel.excluirItens(conexao, req.params.id);

        const resultado = await compraModel.excluirCompra(
            conexao,
            req.params.id
        );

        if (resultado.affectedRows === 0) {
            await conexao.rollback();

            return res.status(404).json({
                sucesso: false,
                mensagem: 'Compra não encontrada.'
            });
        }

        await conexao.commit();

        return res.json({
            sucesso: true,
            mensagem: 'Compra excluída com sucesso.'
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error('Erro ao excluir compra:', erro);

        return res.status(erro.status || 500).json({
            sucesso: false,
            mensagem: erro.status
                ? erro.message
                : 'Erro ao excluir compra.'
        });

    } finally {
        if (conexao) conexao.release();
    }
}

// Editar compra
async function editar(req, res) {
    const { fornecedor_id, data_compra, itens } = req.body;
    const { id } = req.params;

    if (!fornecedor_id) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Selecione um fornecedor.'
        });
    }

    if (!data_compra) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe a data da compra.'
        });
    }

    const erroItens = validarItens(itens);

    if (erroItens) {
        return res.status(400).json({
            sucesso: false,
            mensagem: erroItens
        });
    }

    const valor_total = calcularTotal(itens);
    let conexao;

    try {
        conexao = await compraModel.obterConexao();
        await conexao.beginTransaction();

        const compra = await compraModel.buscarSituacaoEstoque(conexao, id);

        if (!compra) {
            await conexao.rollback();

            return res.status(404).json({
                sucesso: false,
                mensagem: 'Compra não encontrada.'
            });
        }

        const contabilizada = Number(compra.estoque_contabilizado) === 1;

        await compraModel.atualizarCompra(
            conexao,
            id,
            fornecedor_id,
            data_compra,
            valor_total
        );

        if (contabilizada) {
            await compraModel.reverterItens(conexao, id);
        }

        await compraModel.removerMovimentacoes(conexao, id);
        await compraModel.excluirItens(conexao, id);

        for (const item of itens) {
            await compraModel.inserirItem(conexao, id, item);
        }

        if (contabilizada) {
            await compraModel.registrarEntradas(conexao, id, itens);
        }

        await conexao.commit();

        return res.json({
            sucesso: true,
            mensagem: 'Compra atualizada com sucesso.',
            valor_total
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error('Erro ao editar compra:', erro);

        return res.status(erro.status || 500).json({
            sucesso: false,
            mensagem: erro.status
                ? erro.message
                : 'Erro ao editar compra.'
        });

    } finally {
        if (conexao) conexao.release();
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    excluir,
    editar
};
