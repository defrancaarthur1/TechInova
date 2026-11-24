
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.post('/logout', usuarioController.logout);

router.get(
    '/sessao',
    usuarioController.exigirLogin,
    usuarioController.sessao
);

router.get(
    '/usuarios/conta',
    usuarioController.exigirLogin,
    usuarioController.conta
);

router.put(
    '/usuarios/email',
    usuarioController.exigirLogin,
    usuarioController.alterarEmail
);

router.post(
    '/usuarios/verificar-email-senha',
    usuarioController.exigirLogin,
    usuarioController.verificarEmailSenha
);

router.put(
    '/usuarios/senha',
    usuarioController.exigirLogin,
    usuarioController.alterarSenha
);

module.exports = router;
