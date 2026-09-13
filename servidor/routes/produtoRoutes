const express = require('express');
const router = express.Router();

const banco = require('../banco');


// ==============================
// CADASTRAR PRODUTO
// ==============================

router.post('/', async (req, res) => {

    try {

        const {
            nome,
            categoria,
            unidade
        } = req.body;

        console.log('Dados recebidos:', req.body);

        if (!nome || !categoria || !unidade) {

            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos do produto.'
            });

        }

        const [resultado] = await banco.query(
            `
            INSERT INTO produtos
            (nome, categoria, unidade)
            VALUES (?, ?, ?)
            `,
            [
                nome,
                categoria,
                unidade
            ]
        );

        res.status(201).json({

            sucesso: true,

            mensagem:
                'Produto cadastrado com sucesso!',

            id: resultado.insertId

        });

    } catch (erro) {

        console.error(
            'Erro ao cadastrar produto:',
            erro
        );

        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao cadastrar produto.',

            erro: erro.message

        });

    }

});


// ==============================
// LISTAR PRODUTOS
// ==============================

router.get('/', async (req, res) => {

    try {

        const [produtos] =
            await banco.query(
                `
                SELECT *
                FROM produtos
                ORDER BY id DESC
                `
            );

        res.json({

            sucesso: true,

            produtos: produtos

        });

    } catch (erro) {

        console.error(
            'Erro ao listar produtos:',
            erro
        );

        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar produtos.',

            erro: erro.message

        });

    }

});


// ==============================
// BUSCAR UM PRODUTO
// ==============================

router.get('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [produtos] =
            await banco.query(
                `
                SELECT *
                FROM produtos
                WHERE id = ?
                `,
                [id]
            );

        if (produtos.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }

        res.json({

            sucesso: true,

            produto: produtos[0]

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar produto.',

            erro: erro.message

        });

    }

});


// ==============================
// EDITAR PRODUTO
// ==============================

router.put('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nome,
            categoria,
            unidade
        } = req.body;

        if (!nome || !categoria || !unidade) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Preencha todos os campos.'

            });

        }

        const [resultado] =
            await banco.query(
                `
                UPDATE produtos

                SET
                    nome = ?,
                    categoria = ?,
                    unidade = ?

                WHERE id = ?
                `,
                [
                    nome,
                    categoria,
                    unidade,
                    id
                ]
            );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }

        res.json({

            sucesso: true,

            mensagem:
                'Produto editado com sucesso!'

        });

    } catch (erro) {

        console.error(
            'Erro ao editar produto:',
            erro
        );

        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao editar produto.',

            erro: erro.message

        });

    }

});


// ==============================
// EXCLUIR PRODUTO
// ==============================

router.delete('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [resultado] =
            await banco.query(
                `
                DELETE FROM produtos
                WHERE id = ?
                `,
                [id]
            );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }

        res.json({

            sucesso: true,

            mensagem:
                'Produto excluído com sucesso!'

        });

    } catch (erro) {

        console.error(
            'Erro ao excluir produto:',
            erro
        );

        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao excluir produto.',

            erro: erro.message

        });

    }

});


module.exports = router;
