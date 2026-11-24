
const express = require('express');
const router = express.Router();

const fornecedorController =
    require('../controllers/fornecedorController');

// Cadastrar fornecedor
router.post('/', fornecedorController.cadastrar);

// Listar fornecedores
router.get('/', fornecedorController.listar);

// Buscar fornecedor pelo ID
router.get('/:id', fornecedorController.buscarPorId);

// Editar fornecedor
router.put('/:id', fornecedorController.editar);

// Excluir fornecedor
router.delete('/:id', fornecedorController.excluir);

module.exports = router;
