const express = require('express');
const bcrypt = require('bcrypt');

const banco = require('../banco');

const router = express.Router();

router.post('/login', async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Informe o e-mail e a senha.'
            });
        }

        const [usuarios] = await banco.execute(
            `SELECT id, nome, email, senha
             FROM usuarios
             WHERE email = ?
             AND ativo = TRUE`,
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        const usuario = usuarios[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            usuario: req.session.usuario
        });

    } catch (erro) {

        console.error('Erro no login:', erro);

        res.status(500).json({
            mensagem: 'Erro interno do servidor.'
        });
    }
});


router.post('/logout', (req, res) => {

    req.session.destroy((erro) => {

        if (erro) {

            return res.status(500).json({
                mensagem: 'Erro ao encerrar a sessão.'
            });

        }

        res.clearCookie('connect.sid');

        res.json({
            sucesso: true,
            mensagem: 'Logout realizado com sucesso.'
        });

    });

});


module.exports = router;