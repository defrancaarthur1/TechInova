const express = require('express');
const router = express.Router();
console.log('ROTAS DE COMPRAS INICIADAS');
const banco = require('../banco');

// REGISTRAR COMPRA
router.post('/', async (req, res) => {

    try {
        const {
            fornecedor_id,
            data_compra,
            itens
        } = req.body;

        // VALIDAÇÃO
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

        if (!itens || itens.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Adicione pelo menos um produto à compra.'
            });
        }

        // CALCULAR VALOR TOTAL
        let valor_total = 0;

        itens.forEach(item => {
            const subtotal = Number(item.quantidade) * Number(item.valor_unitario);

            valor_total += subtotal;
        });

        // INICIAR TRANSAÇÃO
        const conexao = await banco.getConnection();

        try {
            await conexao.beginTransaction();

            // INSERIR COMPRA
            const [resultadoCompra] = await conexao.query(
                    `INSERT INTO Compras
                    (fornecedor_id, data_compra, valor_total)
                    VALUES (?, ?, ?)`,

                    [
                        fornecedor_id,
                        data_compra,
                        valor_total
                    ]
                );

            const compra_id = resultadoCompra.insertId;

            // INSERIR ITENS
            for (const item of itens) {
                const quantidade = Number(item.quantidade);
                const valor_unitario = Number(item.valor_unitario);
                const subtotal = quantidade * valor_unitario;

                await conexao.query(

                    `INSERT INTO Itens_compra
                    (compra_id, produto_id, quantidade, valor_unitario, subtotal)
                    VALUES (?, ?, ?, ?, ?)`,

                    [
                        compra_id,
                        item.produto_id,
                        quantidade,
                        valor_unitario,
                        subtotal
                    ]
                );
            }

            // CONFIRMAR TRANSAÇÃO
            await conexao.commit();

            res.status(201).json({
                sucesso: true,
                mensagem: 'Compra registrada com sucesso!',
                compra_id: compra_id,
                valor_total: valor_total
            });

        } catch (erro) {

            // DESFAZER SE DER ERRO
            await conexao.rollback();
            throw erro;

        } finally {
            conexao.release();
        }

    } catch (erro) {
        console.error('Erro ao registrar compra:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao registrar compra.'
        });
    }
});

// LISTAR COMPRAS
router.get('/', async (req, res) => {

    try {

        const [compras] = await banco.query(`
            SELECT 
                c.id AS compra_id,
                c.fornecedor_id,
                c.data_compra,
                c.valor_total,
                f.empresa AS fornecedor
            FROM Compras c
            INNER JOIN Fornecedores f
                ON c.fornecedor_id = f.id
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
                FROM Itens_compra ic
                INNER JOIN Produtos p
                    ON ic.produto_id = p.id
                WHERE ic.compra_id = ?
            `, [compra.compra_id]);

            compra.itens = itens;
        }

        res.json({
            sucesso: true,
            compras: compras
        });

    } catch (erro) {

        console.error('Erro ao buscar compras:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar compras.'
        });
    }
});

// EXCLUIR COMPRA
router.delete('/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const conexao = await banco.getConnection();

        try {

            await conexao.beginTransaction();

            // EXCLUIR OS ITENS DA COMPRA
            await conexao.query(
                `DELETE FROM Itens_compra
                 WHERE compra_id = ?`,
                [id]
            );

            // EXCLUIR A COMPRA
            const [resultado] = await conexao.query(
                `DELETE FROM Compras
                 WHERE id = ?`,
                [id]
            );

            // VERIFICAR SE A COMPRA EXISTIA
            if (resultado.affectedRows === 0) {

                await conexao.rollback();

                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Compra não encontrada.'
                });
            }

            await conexao.commit();

            res.json({
                sucesso: true,
                mensagem: 'Compra excluída com sucesso.'
            });

        } catch (erro) {
            await conexao.rollback();
            throw erro;

        } finally {
            conexao.release();
        }

    } catch (erro) {

        console.error('Erro ao excluir compra:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir compra.'
        });
    }
});

console.log('REGISTRANDO ROTA PUT /:id');

// EDITAR COMPRA
router.put('/:id', async (req, res) => {

    console.log('ENTROU NA ROTA PUT!');

    const { id } = req.params;

    const {
        fornecedor_id,
        data_compra,
        itens
    } = req.body;

    // VALIDAÇÕES
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

    if (!itens || itens.length === 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Adicione pelo menos um produto à compra.'
        });
    }

    try {

        // CALCULAR NOVO TOTAL
        let valor_total = 0;

        itens.forEach(item => {

            const quantidade = Number(item.quantidade);
            const valor_unitario = Number(item.valor_unitario);

            valor_total += quantidade * valor_unitario;
        });

        const conexao = await banco.getConnection();

        try {

            await conexao.beginTransaction();

            // ATUALIZAR COMPRA
            const [resultadoCompra] = await conexao.query(
                `UPDATE Compras
                 SET fornecedor_id = ?,
                     data_compra = ?,
                     valor_total = ?
                 WHERE id = ?`,
                [
                    fornecedor_id,
                    data_compra,
                    valor_total,
                    id
                ]
            );

            // VERIFICAR SE A COMPRA EXISTE
            if (resultadoCompra.affectedRows === 0) {

                await conexao.rollback();

                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Compra não encontrada.'
                });
            }

            // APAGAR ITENS ANTIGOS
            await conexao.query(
                `DELETE FROM Itens_compra
                 WHERE compra_id = ?`,
                [id]
            );

            // INSERIR ITENS NOVOS
            for (const item of itens) {

                const quantidade = Number(item.quantidade);
                const valor_unitario = Number(item.valor_unitario);
                const subtotal = quantidade * valor_unitario;

                await conexao.query(
                    `INSERT INTO Itens_compra
                    (compra_id, produto_id, quantidade, valor_unitario, subtotal)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        id,
                        item.produto_id,
                        quantidade,
                        valor_unitario,
                        subtotal
                    ]
                );
            }

            await conexao.commit();

            res.json({
                sucesso: true,
                mensagem: 'Compra atualizada com sucesso.',
                valor_total: valor_total
            });

        } catch (erro) {

            await conexao.rollback();
            throw erro;

        } finally {
            conexao.release();
        }

    } catch (erro) {

        console.error('Erro ao editar compra:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao editar compra.'
        });
    }
});

console.log('ROTA PUT DE COMPRAS CARREGADA');
module.exports = router;