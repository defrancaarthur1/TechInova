
const produtoModel = require('../models/produtoModel');

// Categorias utilizadas pelo sistema
const categorias = {
    1: 'Bebidas',
    2: 'Cervejas',
    3: 'Refrigerantes',
    4: 'Destilados',
    5: 'Água',
    6: 'Gelo',
    7: 'Outros'
};

function obterCategoria(categoria_id) {
    return categorias[Number(categoria_id)] || null;
}

function obterCategoriaId(nomeCategoria) {
    if (!nomeCategoria) return null;

    if (String(nomeCategoria).trim().toLowerCase() === 'sucos') {
        return 1;
    }

    const encontrada = Object.entries(categorias).find(
        ([id, nome]) =>
            nome.toLowerCase() === String(nomeCategoria).trim().toLowerCase()
    );

    return encontrada ? Number(encontrada[0]) : null;
}

function formatarProduto(produto) {
    return {
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria,
        categoria_id: obterCategoriaId(produto.categoria),
        unidade: produto.unidade,
        estoque: Number(produto.estoque)
    };
}

// Cadastrar produto
async function cadastrar(req, res) {
    try {
        const { nome, categoria_id, unidade } = req.body;

        if (!nome || !categoria_id || !unidade) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos do produto.'
            });
        }

        const nomeLimpo = String(nome).trim();
        const unidadeLimpa = String(unidade).trim();
        const categoriaNome = obterCategoria(categoria_id);

        if (!categoriaNome) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Categoria inválida.'
            });
        }

        const duplicado = await produtoModel.buscarDuplicado(
            nomeLimpo,
            categoriaNome,
            unidadeLimpa
        );

        if (duplicado.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este produto já está cadastrado.'
            });
        }

        const resultado = await produtoModel.criar(
            nomeLimpo,
            categoriaNome,
            unidadeLimpa
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar produto.',
            erro: erro.message
        });
    }
}

// Listar produtos
async function listar(req, res) {
    try {
        const produtos = await produtoModel.listarTodos();

        return res.json({
            sucesso: true,
            produtos: produtos.map(formatarProduto)
        });

    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar produtos.',
            erro: erro.message
        });
    }
}

// Buscar produto pelo ID
async function buscarPorId(req, res) {
    try {
        const produtos = await produtoModel.buscarPorId(req.params.id);

        if (produtos.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            produto: formatarProduto(produtos[0])
        });

    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar produto.',
            erro: erro.message
        });
    }
}

// Editar produto
async function editar(req, res) {
    try {
        const { nome, categoria_id, unidade } = req.body;
        const { id } = req.params;

        if (!nome || !categoria_id || !unidade) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha todos os campos do produto.'
            });
        }

        const nomeLimpo = String(nome).trim();
        const unidadeLimpa = String(unidade).trim();
        const categoriaNome = obterCategoria(categoria_id);

        if (!categoriaNome) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Categoria inválida.'
            });
        }

        const duplicado = await produtoModel.buscarDuplicado(
            nomeLimpo,
            categoriaNome,
            unidadeLimpa,
            id
        );

        if (duplicado.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Já existe outro produto com estes dados.'
            });
        }

        const resultado = await produtoModel.atualizar(
            id,
            nomeLimpo,
            categoriaNome,
            unidadeLimpa
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            mensagem: 'Produto editado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao editar produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao editar produto.',
            erro: erro.message
        });
    }
}

// Excluir produto
async function excluir(req, res) {
    try {
        const { id } = req.params;

        const vinculos = await produtoModel.contarVinculos(id);

        if (
            Number(vinculos.itens) > 0 ||
            Number(vinculos.movimentacoes) > 0
        ) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Produto com histórico de compras ou movimentações não pode ser excluído.'
            });
        }

        const resultado = await produtoModel.excluir(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        return res.json({
            sucesso: true,
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir produto.',
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
