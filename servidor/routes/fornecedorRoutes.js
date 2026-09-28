const express = require('express');

const router = express.Router();

const banco = require('../banco');


// ========================================
// CADASTRAR FORNECEDOR
// POST /api/fornecedores
// ========================================

router.post('/', async (req, res) => {

    try {

        const {
            empresa,
            cnpj,
            telefone,
            consultor,
            email,
            data_cadastro
        } = req.body;


        if (!empresa || !cnpj) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Empresa e CNPJ são obrigatórios.'

            });

        }


        const [resultado] =
            await banco.query(

                `
                INSERT INTO Fornecedores
                (
                    empresa,
                    CNPJ,
                    telefone,
                    consultor,
                    email,
                    data_cadastro
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,

                [
                    empresa,
                    cnpj,
                    telefone || null,
                    consultor || null,
                    email || null,
                    data_cadastro || null
                ]

            );


        res.status(201).json({

            sucesso: true,

            mensagem:
                'Fornecedor cadastrado com sucesso!',

            id:
                resultado.insertId

        });


    } catch (erro) {

        console.error(
            'Erro ao cadastrar fornecedor:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao cadastrar fornecedor.',

            erro:
                erro.message

        });

    }

});


// ========================================
// LISTAR TODOS OS FORNECEDORES
// GET /api/fornecedores
// ========================================

router.get('/', async (req, res) => {

    try {

        const [fornecedores] =
            await banco.query(

                `
                SELECT *
                FROM Fornecedores
                ORDER BY empresa ASC
                `

            );


        res.json({

            sucesso: true,

            fornecedores:
                fornecedores

        });


    } catch (erro) {

        console.error(
            'Erro ao buscar fornecedores:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar fornecedores.',

            erro:
                erro.message

        });

    }

});


// ========================================
// BUSCAR FORNECEDOR PELO ID
// GET /api/fornecedores/:id
// ========================================

router.get('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const [fornecedores] =
            await banco.query(

                `
                SELECT *
                FROM Fornecedores
                WHERE id = ?
                `,

                [id]

            );


        if (fornecedores.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Fornecedor não encontrado.'

            });

        }


        res.json({

            sucesso: true,

            fornecedor:
                fornecedores[0]

        });


    } catch (erro) {

        console.error(
            'Erro ao buscar fornecedor:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar fornecedor.',

            erro:
                erro.message

        });

    }

});


// ========================================
// EDITAR FORNECEDOR
// PUT /api/fornecedores/:id
// ========================================

router.put('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const {
            empresa,
            cnpj,
            telefone,
            consultor,
            email,
            data_cadastro
        } = req.body;


        if (!empresa || !cnpj) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Empresa e CNPJ são obrigatórios.'

            });

        }


        const [resultado] =
            await banco.query(

                `
                UPDATE Fornecedores

                SET
                    empresa = ?,
                    CNPJ = ?,
                    telefone = ?,
                    consultor = ?,
                    email = ?,
                    data_cadastro = ?

                WHERE id = ?
                `,

                [
                    empresa,
                    cnpj,
                    telefone || null,
                    consultor || null,
                    email || null,
                    data_cadastro || null,
                    id
                ]

            );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Fornecedor não encontrado.'

            });

        }


        res.json({

            sucesso: true,

            mensagem:
                'Fornecedor editado com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao editar fornecedor:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao editar fornecedor.',

            erro:
                erro.message

        });

    }

});


// ========================================
// EXCLUIR FORNECEDOR
// DELETE /api/fornecedores/:id
// ========================================

router.delete('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const [resultado] =
            await banco.query(

                `
                DELETE FROM Fornecedores
                WHERE id = ?
                `,

                [id]

            );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Fornecedor não encontrado.'

            });

        }


        res.json({

            sucesso: true,

            mensagem:
                'Fornecedor excluído com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao excluir fornecedor:',
            erro
        );


        res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao excluir fornecedor.',

            erro:
                erro.message

        });

    }

});


module.exports = router;
