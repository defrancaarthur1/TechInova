
const fornecedorModel = require('../models/fornecedorModel');

// Cadastrar fornecedor
async function cadastrar(req, res) {
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

        const fornecedorExistente =
            await fornecedorModel.buscarPorCnpj(cnpj.trim());

        if (fornecedorExistente.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe um fornecedor cadastrado com este CNPJ.'
            });
        }

        const resultado = await fornecedorModel.criar({
            empresa: empresa.trim(),
            cnpj: cnpj.trim(),
            telefone: telefone ? telefone.trim() : null,
            consultor: consultor ? consultor.trim() : null,
            email: email ? email.trim() : null,
            data_cadastro: data_cadastro || null
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Fornecedor cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar fornecedor:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar fornecedor.',
            erro: erro.message
        });
    }
}

// Listar fornecedores
async function listar(req, res) {
    try {
        const fornecedores = await fornecedorModel.listarTodos();

        return res.json({
            sucesso: true,
            fornecedores
        });

    } catch (erro) {
        console.error('Erro ao buscar fornecedores:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar fornecedores.',
            erro: erro.message
        });
    }
}

// Buscar fornecedor pelo ID
async function buscarPorId(req, res) {
    try {
        const fornecedores =
            await fornecedorModel.buscarPorId(req.params.id);

        if (fornecedores.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            fornecedor: fornecedores[0]
        });

    } catch (erro) {
        console.error('Erro ao buscar fornecedor:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar fornecedor.',
            erro: erro.message
        });
    }
}

// Editar fornecedor
async function editar(req, res) {
    try {
        const { id } = req.params;
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

        const fornecedorExistente =
            await fornecedorModel.buscarPorCnpjNaEdicao(cnpj.trim(), id);

        if (fornecedorExistente.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe outro fornecedor cadastrado com este CNPJ.'
            });
        }

        const resultado = await fornecedorModel.atualizar(id, {
            empresa: empresa.trim(),
            cnpj: cnpj.trim(),
            telefone: telefone ? telefone.trim() : null,
            consultor: consultor ? consultor.trim() : null,
            email: email ? email.trim() : null,
            data_cadastro: data_cadastro || null
        });

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            mensagem: 'Fornecedor editado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao editar fornecedor:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao editar fornecedor.',
            erro: erro.message
        });
    }
}

// Excluir fornecedor
async function excluir(req, res) {
    try {
        const resultado =
            await fornecedorModel.excluir(req.params.id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Fornecedor não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            mensagem: 'Fornecedor excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir fornecedor:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir fornecedor.',
            erro: erro.message
        });
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    editar,
    excluir
};
