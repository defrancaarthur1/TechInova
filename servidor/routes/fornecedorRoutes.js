const express = require('express');
const router = express.Router();

const banco = require('../banco');

// CADASTRAR FORNECEDOR
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
                mensagem: 'Empresa e CNPJ são obrigatórios.'
            });
        }

        const [resultado] = await banco.query(
            `INSERT INTO Fornecedores
            (empresa, CNPJ, telefone, consultor, email, data_cadastro)
            VALUES (?, ?, ?, ?, ?, ?)`,
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
            mensagem: 'Fornecedor cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar fornecedor:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar fornecedor.'
        });
    }
});

// LISTAR FORNECEDORES
router.get('/', async (req, res) => {
    try {
        const [fornecedores] = await banco.query(
            'SELECT * FROM Fornecedores ORDER BY id DESC'
        );

        res.json({
            sucesso: true,
            fornecedores
        });

    } catch (erro) {
        console.error('Erro ao buscar fornecedores:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar fornecedores.'
        });
    }
});

module.exports = router;