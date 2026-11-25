
const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController');

// Cadastrar produto
router.post('/', produtoController.cadastrar);

// Listar produtos
router.get('/', produtoController.listar);

// Buscar produto pelo ID
router.get('/:id', produtoController.buscarPorId);

// Editar produto
router.put('/:id', produtoController.editar);

// Excluir produto
router.delete('/:id', produtoController.excluir);

module.exports = router;
