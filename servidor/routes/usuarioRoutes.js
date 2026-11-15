const express = require('express');
const bcrypt = require('bcrypt');
const banco = require('../banco');
const router = express.Router();

const emailValido = (valor) => typeof valor === 'string' && valor.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
const senhaValida = (valor) => typeof valor === 'string' && valor.length >= 8 && Buffer.byteLength(valor, 'utf8') <= 72 && /[0-9]/.test(valor) && /[^A-Za-z0-9\s]/.test(valor);
const normalizarEmail = (valor) => typeof valor === 'string' ? valor.trim().toLowerCase() : '';

async function buscarUsuario(id) {
    const [usuarios] = await banco.execute('SELECT id, nome, email, senha FROM usuarios WHERE id = ? AND ativo = TRUE', [id]);
    return usuarios[0];
}

function exigirLogin(req, res, next) {
    if (!req.session?.usuario?.id) return res.status(401).json({ mensagem: 'Faça login novamente.' });
    next();
}

function encerrarSessao(req, res) {
    req.session.destroy((erro) => {
        if (erro) return res.status(500).json({ mensagem: 'Alteração salva, mas não foi possível encerrar a sessão. Saia e entre novamente.' });
        res.clearCookie('connect.sid');
        res.json({ sucesso: true, mensagem: 'Alteração realizada. Faça login novamente.' });
    });
}

router.post('/login', async (req, res) => {
    try {
        const email = normalizarEmail(req.body?.email);
        const senha = req.body?.senha;
        if (!emailValido(email) || typeof senha !== 'string') return res.status(400).json({ mensagem: 'Informe um e-mail e uma senha válidos.' });
        const [usuarios] = await banco.execute('SELECT id, nome, email, senha FROM usuarios WHERE email = ? AND ativo = TRUE', [email]);
        const usuario = usuarios[0];
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        req.session.regenerate((erro) => {
            if (erro) return res.status(500).json({ mensagem: 'Não foi possível iniciar a sessão.' });
            req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
            req.session.credencial = usuario.senha;
            req.session.save((erroSalvar) => {
                if (erroSalvar) return res.status(500).json({ mensagem: 'Não foi possível salvar a sessão.' });
                res.json({ sucesso: true, mensagem: 'Login realizado com sucesso!', usuario: req.session.usuario });
            });
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) return res.status(500).json({ mensagem: 'Erro ao encerrar a sessão.' });
        res.clearCookie('connect.sid');
        res.json({ sucesso: true, mensagem: 'Logout realizado com sucesso.' });
    });
});

router.get('/sessao', exigirLogin, (req, res) => res.json({ autenticado: true, usuario: req.session.usuario }));

router.get('/usuarios/conta', exigirLogin, async (req, res) => {
    try {
        const usuario = await buscarUsuario(req.session.usuario.id);
        if (!usuario) return res.status(401).json({ mensagem: 'Conta não encontrada.' });
        res.json({ nome: usuario.nome, email: usuario.email });
    } catch (erro) {
        console.error('Erro ao consultar conta:', erro);
        res.status(500).json({ mensagem: 'Erro ao consultar conta.' });
    }
});

router.put('/usuarios/email', exigirLogin, async (req, res) => {
    try {
        const email = normalizarEmail(req.body?.novoEmail);
        const senha = req.body?.senhaAtual;
        if (!emailValido(email) || typeof senha !== 'string') return res.status(400).json({ mensagem: 'Informe o novo e-mail e a senha atual.' });
        const usuario = await buscarUsuario(req.session.usuario.id);
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
        if (email === usuario.email.toLowerCase()) return res.status(400).json({ mensagem: 'Informe um e-mail diferente do atual.' });
        await banco.execute('UPDATE usuarios SET email = ? WHERE id = ? AND ativo = TRUE', [email, usuario.id]);
        encerrarSessao(req, res);
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
        console.error('Erro ao alterar e-mail:', erro);
        res.status(500).json({ mensagem: 'Erro ao alterar e-mail.' });
    }
});

router.put('/usuarios/senha', exigirLogin, async (req, res) => {
    try {
        const { senhaAtual, novaSenha, confirmarSenha } = req.body || {};
        if (typeof senhaAtual !== 'string' || !senhaValida(novaSenha) || novaSenha !== confirmarSenha) return res.status(400).json({ mensagem: 'A nova senha deve ter no mínimo 8 caracteres, incluir pelo menos 1 número e 1 símbolo, respeitar o limite de 72 bytes e coincidir com a confirmação.' });
        const usuario = await buscarUsuario(req.session.usuario.id);
        if (!usuario || !(await bcrypt.compare(senhaAtual, usuario.senha))) return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
        if (await bcrypt.compare(novaSenha, usuario.senha)) return res.status(400).json({ mensagem: 'Escolha uma senha diferente da atual.' });
        const hash = await bcrypt.hash(novaSenha, 12);
        await banco.execute('UPDATE usuarios SET senha = ? WHERE id = ? AND ativo = TRUE', [hash, usuario.id]);
        encerrarSessao(req, res);
    } catch (erro) {
        console.error('Erro ao alterar senha:', erro);
        res.status(500).json({ mensagem: 'Erro ao alterar senha.' });
    }
});

module.exports = router;
