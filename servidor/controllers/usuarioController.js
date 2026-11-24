
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

const emailValido = (valor) =>
    typeof valor === 'string' &&
    valor.length <= 150 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

const senhaValida = (valor) =>
    typeof valor === 'string' &&
    valor.length >= 8 &&
    Buffer.byteLength(valor, 'utf8') <= 72 &&
    /[0-9]/.test(valor) &&
    /[^A-Za-z0-9\s]/.test(valor);

const normalizarEmail = (valor) =>
    typeof valor === 'string' ? valor.trim().toLowerCase() : '';

function exigirLogin(req, res, next) {
    if (!req.session?.usuario?.id) {
        return res.status(401).json({ mensagem: 'Faça login novamente.' });
    }

    next();
}

function encerrarSessao(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({
                mensagem: 'Alteração salva, mas não foi possível encerrar a sessão. Saia e entre novamente.'
            });
        }

        res.clearCookie('connect.sid');
        res.json({
            sucesso: true,
            mensagem: 'Alteração realizada. Faça login novamente.'
        });
    });
}

async function login(req, res) {
    try {
        const email = normalizarEmail(req.body?.email);
        const senha = req.body?.senha;

        if (!emailValido(email) || typeof senha !== 'string') {
            return res.status(400).json({
                mensagem: 'Informe um e-mail e uma senha válidos.'
            });
        }

        const usuario = await usuarioModel.buscarPorEmail(email);

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        req.session.regenerate((erro) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Não foi possível iniciar a sessão.'
                });
            }

            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            };

            req.session.credencial = usuario.senha;

            req.session.save((erroSalvar) => {
                if (erroSalvar) {
                    return res.status(500).json({
                        mensagem: 'Não foi possível salvar a sessão.'
                    });
                }

                res.json({
                    sucesso: true,
                    mensagem: 'Login realizado com sucesso!',
                    usuario: req.session.usuario
                });
            });
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

function logout(req, res) {
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
}

function sessao(req, res) {
    res.json({
        autenticado: true,
        usuario: req.session.usuario
    });
}

async function conta(req, res) {
    try {
        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Conta não encontrada.'
            });
        }

        res.json({ nome: usuario.nome });
    } catch (erro) {
        console.error('Erro ao consultar conta:', erro);
        res.status(500).json({ mensagem: 'Erro ao consultar conta.' });
    }
}

async function alterarEmail(req, res) {
    try {
        const email = normalizarEmail(req.body?.novoEmail);
        const senha = req.body?.senhaAtual;

        if (!emailValido(email) || typeof senha !== 'string') {
            return res.status(400).json({
                mensagem: 'Informe o novo e-mail e a senha atual.'
            });
        }

        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({
                mensagem: 'Senha atual incorreta.'
            });
        }

        if (email === usuario.email.toLowerCase()) {
            return res.status(400).json({
                mensagem: 'Informe um e-mail diferente do atual.'
            });
        }

        await usuarioModel.atualizarEmail(usuario.id, email);
        encerrarSessao(req, res);

    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'E-mail já cadastrado.'
            });
        }

        console.error('Erro ao alterar e-mail:', erro);
        res.status(500).json({ mensagem: 'Erro ao alterar e-mail.' });
    }
}

async function verificarEmailSenha(req, res) {
    try {
        const agora = Date.now();

        const limite = req.session.tentativasEmail || {
            inicio: agora,
            quantidade: 0
        };

        if (agora - limite.inicio > 15 * 60 * 1000) {
            limite.inicio = agora;
            limite.quantidade = 0;
        }

        if (limite.quantidade >= 5) {
            return res.status(429).json({
                mensagem: 'Muitas tentativas. Aguarde 15 minutos.'
            });
        }

        limite.quantidade++;
        req.session.tentativasEmail = limite;
        req.session.emailVerificadoSenha = null;

        const email = normalizarEmail(req.body?.email);
        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);

        if (
            !usuario ||
            !emailValido(email) ||
            email !== normalizarEmail(usuario.email)
        ) {
            return res.status(403).json({
                mensagem: 'E-mail não corresponde ao cadastro.'
            });
        }

        req.session.emailVerificadoSenha = {
            email,
            ate: agora + 5 * 60 * 1000
        };

        req.session.save((erro) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Não foi possível salvar a verificação.'
                });
            }

            res.json({
                sucesso: true,
                mensagem: 'E-mail conferido.'
            });
        });

    } catch (erro) {
        console.error('Erro na conferência de e-mail:', erro);
        res.status(500).json({ mensagem: 'Erro ao conferir e-mail.' });
    }
}

async function alterarSenha(req, res) {
    try {
        const { email: emailInformado, novaSenha, confirmarSenha } = req.body || {};
        const email = normalizarEmail(emailInformado);
        const verificacao = req.session.emailVerificadoSenha;

        if (
            !verificacao ||
            verificacao.ate < Date.now() ||
            verificacao.email !== email
        ) {
            return res.status(403).json({
                mensagem: 'Verifique o e-mail cadastrado novamente.'
            });
        }

        if (!senhaValida(novaSenha) || novaSenha !== confirmarSenha) {
            return res.status(400).json({
                mensagem: 'A senha deve ter no mínimo 8 caracteres, 1 número e 1 símbolo, até 72 bytes e coincidir com a confirmação.'
            });
        }

        const usuario = await usuarioModel.buscarPorId(req.session.usuario.id);

        if (!usuario || email !== normalizarEmail(usuario.email)) {
            return res.status(403).json({
                mensagem: 'E-mail não corresponde ao cadastro.'
            });
        }

        if (await bcrypt.compare(novaSenha, usuario.senha)) {
            return res.status(400).json({
                mensagem: 'Escolha uma senha diferente da atual.'
            });
        }

        req.session.emailVerificadoSenha = null;

        const hash = await bcrypt.hash(novaSenha, 12);

        await usuarioModel.atualizarSenha(usuario.id, hash);

        encerrarSessao(req, res);

    } catch (erro) {
        console.error('Erro ao alterar senha:', erro);
        res.status(500).json({ mensagem: 'Erro ao alterar senha.' });
    }
}

module.exports = {
    exigirLogin,
    login,
    logout,
    sessao,
    conta,
    alterarEmail,
    verificarEmailSenha,
    alterarSenha
};
