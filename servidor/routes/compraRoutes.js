
const express = require('express');
const router = express.Router();

const compraController = require('../controllers/compraController');

// Registrar compra
router.post('/', compraController.cadastrar);

// Listar todas as compras
router.get('/', compraController.listar);

// Buscar compra pelo ID
router.get('/:id', compraController.buscarPorId);

// Excluir compra
router.delete('/:id', compraController.excluir);

// Editar compra
router.put('/:id', compraController.editar);

module.exports = router;
