const tratarErroBanco =
    require('../utils/tratarErroBanco');

const express = require('express');
const router = express.Router();

console.log('ROTAS DE COMPRAS INICIADAS');

const banco = require('../banco');


// ======================================================
// REGISTRAR COMPRA
// ======================================================

router.post('/', async (req, res) => {

    try {

        const {
            fornecedor_id,
            data_compra,
            itens
        } = req.body;


        // ==============================================
        // VALIDAÇÕES
        // ==============================================

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


        // ==============================================
        // CALCULAR VALOR TOTAL
        // ==============================================

        let valor_total = 0;


        itens.forEach(item => {

            const subtotal =
                Number(item.quantidade) *
                Number(item.valor_unitario);


            valor_total += subtotal;

        });


        // ==============================================
        // INICIAR TRANSAÇÃO
        // ==============================================

        const conexao =
            await banco.getConnection();


        try {

            await conexao.beginTransaction();


            // ==========================================
            // INSERIR COMPRA
            // ==========================================

            const [resultadoCompra] =
                await conexao.query(

                    `INSERT INTO Compras
                    (fornecedor_id, data_compra, valor_total)
                    VALUES (?, ?, ?)`,

                    [
                        fornecedor_id,
                        data_compra,
                        valor_total
                    ]

                );


            const compra_id =
                resultadoCompra.insertId;


            // ==========================================
            // INSERIR ITENS DA COMPRA
            // ==========================================

            for (const item of itens) {

                const quantidade =
                    Number(item.quantidade);


                const valor_unitario =
                    Number(item.valor_unitario);


                const subtotal =
                    quantidade * valor_unitario;


                await conexao.query(

                    `INSERT INTO Itens_compra
                    (
                        compra_id,
                        produto_id,
                        quantidade,
                        valor_unitario,
                        subtotal
                    )
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


            // ==========================================
            // CONFIRMAR TRANSAÇÃO
            // ==========================================

            await conexao.commit();


            res.status(201).json({

                sucesso: true,

                mensagem:
                    'Compra registrada com sucesso!',

                compra_id:
                    compra_id,

                valor_total:
                    valor_total

            });


        } catch (erro) {

            // ==========================================
            // DESFAZER ALTERAÇÕES EM CASO DE ERRO
            // ==========================================

            await conexao.rollback();

            throw erro;


        } finally {

            conexao.release();

        }


    } catch (erro) {

        console.error(
            'Erro ao registrar compra:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao registrar compra.'

        });

    }

});


// ======================================================
// LISTAR TODAS AS COMPRAS
// ======================================================

router.get('/', async (req, res) => {

    try {


        // ==============================================
        // BUSCAR COMPRAS
        // ==============================================

        const [compras] =
            await banco.query(`

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


        // ==============================================
        // BUSCAR ITENS DE CADA COMPRA
        // ==============================================

        for (const compra of compras) {


            const [itens] =
                await banco.query(`

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

                `,

                [
                    compra.compra_id
                ]);


            compra.itens = itens;

        }


        // ==============================================
        // RETORNAR COMPRAS
        // ==============================================

        res.json({

            sucesso: true,

            compras: compras

        });


    } catch (erro) {


        console.error(
            'Erro ao buscar compras:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar compras.'

        });

    }

});


// ======================================================
// BUSCAR UMA COMPRA PELO ID
// ======================================================
// Esta rota é utilizada quando clicamos em "Editar"
// no Histórico.
//
// Exemplo:
//
// GET /api/compras/5
//
// Ela devolve a compra e TODOS os itens relacionados.
// ======================================================

router.get('/:id', async (req, res) => {


    const { id } =
        req.params;


    try {


        // ==============================================
        // BUSCAR COMPRA
        // ==============================================

        const [compras] =
            await banco.query(`

                SELECT

                    c.id AS compra_id,

                    c.fornecedor_id,

                    c.data_compra,

                    c.valor_total,

                    f.empresa AS fornecedor

                FROM Compras c

                INNER JOIN Fornecedores f
                    ON c.fornecedor_id = f.id

                WHERE c.id = ?

            `,

            [
                id
            ]);


        // ==============================================
        // VERIFICAR SE A COMPRA EXISTE
        // ==============================================

        if (compras.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Compra não encontrada.'

            });

        }


        const compra =
            compras[0];


        // ==============================================
        // BUSCAR ITENS DA COMPRA
        // ==============================================

        const [itens] =
            await banco.query(`

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

                ORDER BY ic.id

            `,

            [
                id
            ]);


        compra.itens =
            itens;


        // ==============================================
        // RETORNAR COMPRA COMPLETA
        // ==============================================

        res.json({

            sucesso: true,

            compra: compra

        });


    } catch (erro) {


        console.error(
            'Erro ao buscar compra:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar compra.'

        });

    }

});


// ======================================================
// EXCLUIR COMPRA
// ======================================================

router.delete('/:id', async (req, res) => {


    const { id } =
        req.params;


    try {


        const conexao =
            await banco.getConnection();


        try {


            await conexao.beginTransaction();


            // ==========================================
            // EXCLUIR PRIMEIRO OS ITENS
            // ==========================================

            await conexao.query(

                `DELETE FROM Itens_compra
                 WHERE compra_id = ?`,

                [
                    id
                ]

            );


            // ==========================================
            // EXCLUIR A COMPRA
            // ==========================================

            const [resultado] =
                await conexao.query(

                    `DELETE FROM Compras
                     WHERE id = ?`,

                    [
                        id
                    ]

                );


            // ==========================================
            // VERIFICAR SE A COMPRA EXISTIA
            // ==========================================

            if (
                resultado.affectedRows === 0
            ) {


                await conexao.rollback();


                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        'Compra não encontrada.'

                });

            }


            // ==========================================
            // CONFIRMAR EXCLUSÃO
            // ==========================================

            await conexao.commit();


            res.json({

                sucesso: true,

                mensagem:
                    'Compra excluída com sucesso.'

            });


        } catch (erro) {


            await conexao.rollback();

            throw erro;


        } finally {


            conexao.release();

        }


    } catch (erro) {


        console.error(
            'Erro ao excluir compra:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao excluir compra.'

        });

    }

});


// ======================================================
// EDITAR COMPRA
// ======================================================

console.log(
    'REGISTRANDO ROTA PUT /:id'
);


router.put('/:id', async (req, res) => {


    console.log(
        'ENTROU NA ROTA PUT!'
    );


    const { id } =
        req.params;


    const {

        fornecedor_id,

        data_compra,

        itens

    } = req.body;


    // ==================================================
    // VALIDAÇÃO DO FORNECEDOR
    // ==================================================

    if (!fornecedor_id) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                'Selecione um fornecedor.'

        });

    }


    // ==================================================
    // VALIDAÇÃO DA DATA
    // ==================================================

    if (!data_compra) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                'Informe a data da compra.'

        });

    }


    // ==================================================
    // VALIDAÇÃO DOS ITENS
    // ==================================================

    if (
        !itens ||
        itens.length === 0
    ) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                'Adicione pelo menos um produto à compra.'

        });

    }


    try {


        // ==============================================
        // CALCULAR NOVO VALOR TOTAL
        // ==============================================

        let valor_total = 0;


        itens.forEach(item => {


            const quantidade =
                Number(
                    item.quantidade
                );


            const valor_unitario =
                Number(
                    item.valor_unitario
                );


            valor_total +=
                quantidade *
                valor_unitario;

        });


        // ==============================================
        // PEGAR CONEXÃO
        // ==============================================

        const conexao =
            await banco.getConnection();


        try {


            // ==========================================
            // INICIAR TRANSAÇÃO
            // ==========================================

            await conexao.beginTransaction();


            // ==========================================
            // ATUALIZAR DADOS PRINCIPAIS DA COMPRA
            // ==========================================

            const [resultadoCompra] =
                await conexao.query(

                    `UPDATE Compras

                     SET

                        fornecedor_id = ?,

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


            // ==========================================
            // VERIFICAR SE A COMPRA EXISTE
            // ==========================================

            if (
                resultadoCompra.affectedRows === 0
            ) {


                await conexao.rollback();


                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        'Compra não encontrada.'

                });

            }


            // ==========================================
            // REMOVER ITENS ANTIGOS
            // ==========================================
            //
            // Como a compra pode possuir vários itens,
            // removemos os itens antigos e cadastramos
            // novamente a lista atualizada.
            // ==========================================

            await conexao.query(

                `DELETE FROM Itens_compra
                 WHERE compra_id = ?`,

                [
                    id
                ]

            );


            // ==========================================
            // INSERIR ITENS ATUALIZADOS
            // ==========================================

            for (const item of itens) {


                const quantidade =
                    Number(
                        item.quantidade
                    );


                const valor_unitario =
                    Number(
                        item.valor_unitario
                    );


                const subtotal =
                    quantidade *
                    valor_unitario;


                await conexao.query(

                    `INSERT INTO Itens_compra

                    (
                        compra_id,
                        produto_id,
                        quantidade,
                        valor_unitario,
                        subtotal
                    )

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


            // ==========================================
            // CONFIRMAR ALTERAÇÕES
            // ==========================================

            await conexao.commit();


            res.json({

                sucesso: true,

                mensagem:
                    'Compra atualizada com sucesso.',

                valor_total:
                    valor_total

            });


        } catch (erro) {


            // ==========================================
            // DESFAZER ALTERAÇÕES
            // ==========================================

            await conexao.rollback();


            throw erro;


        } finally {


            conexao.release();

        }


    } catch (erro) {


        console.error(
            'Erro ao editar compra:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao editar compra.'

        });

    }

});


console.log(
    'ROTA PUT DE COMPRAS CARREGADA'
);


// ======================================================
// EXPORTAR ROTAS
// ======================================================

module.exports = router;
