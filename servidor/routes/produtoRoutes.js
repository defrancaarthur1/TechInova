const tratarErroBanco =
    require('../utils/tratarErroBanco');
const express = require('express');
const router = express.Router();
const banco = require('../banco');


// =====================================================
// CATEGORIAS DO SISTEMA
// =====================================================
//
// O frontend envia categoria_id.
// O banco atual armazena o NOME da categoria.
//
// Exemplo:
// categoria_id = 3
// banco = "Refrigerantes"
// =====================================================

const categorias = {
    1: 'Bebidas',
    2: 'Cervejas',
    3: 'Refrigerantes',
    4: 'Destilados',
    5: 'Água',
    6: 'Gelo',
    7: 'Outros'
};


// =====================================================
// OBTER NOME DA CATEGORIA PELO ID
// =====================================================

function obterCategoria(categoria_id) {

    return categorias[Number(categoria_id)] || null;

}


// =====================================================
// OBTER ID DA CATEGORIA PELO NOME
// =====================================================

function obterCategoriaId(nomeCategoria) {

    if (!nomeCategoria) {
        return null;
    }

    const categoriaEncontrada = Object.entries(categorias)
        .find(([id, nome]) => {

            return nome.toLowerCase() ===
                String(nomeCategoria).trim().toLowerCase();

        });


    return categoriaEncontrada
        ? Number(categoriaEncontrada[0])
        : null;

}


// =====================================================
// CADASTRAR PRODUTO
// POST /api/produtos
// =====================================================

router.post('/', async (req, res) => {

    try {

        const {
            nome,
            categoria_id,
            unidade
        } = req.body;


        // -------------------------------------------------
        // VALIDAR CAMPOS OBRIGATÓRIOS
        // -------------------------------------------------

        if (!nome || !categoria_id || !unidade) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Preencha todos os campos do produto.'

            });

        }


        const nomeLimpo =
            String(nome).trim();

        const unidadeLimpa =
            String(unidade).trim();

        const categoriaNome =
            obterCategoria(categoria_id);


        // -------------------------------------------------
        // VALIDAR CATEGORIA
        // -------------------------------------------------

        if (!categoriaNome) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Categoria inválida.'

            });

        }


        // -------------------------------------------------
        // VERIFICAR PRODUTO DUPLICADO
        // -------------------------------------------------
        //
        // Consideramos duplicado quando:
        //
        // nome + categoria + unidade
        //
        // forem iguais.
        //
        // LOWER e TRIM também impedem diferenças como:
        //
        // Coca Cola
        // coca cola
        // Coca Cola
        // -------------------------------------------------

        const [produtoExistente] = await banco.query(

            `
            SELECT id
            FROM produtos

            WHERE LOWER(TRIM(nome)) = LOWER(?)
              AND LOWER(TRIM(categoria)) = LOWER(?)
              AND LOWER(TRIM(unidade)) = LOWER(?)

            LIMIT 1
            `,

            [
                nomeLimpo,
                categoriaNome,
                unidadeLimpa
            ]

        );


        if (produtoExistente.length > 0) {

            return res.status(409).json({

                sucesso: false,

                mensagem:
                    'Este produto já está cadastrado.'

            });

        }


        // -------------------------------------------------
        // INSERIR PRODUTO
        // -------------------------------------------------

        const [resultado] = await banco.query(

            `
            INSERT INTO produtos
            (
                nome,
                categoria,
                unidade
            )

            VALUES (?, ?, ?)
            `,

            [
                nomeLimpo,
                categoriaNome,
                unidadeLimpa
            ]

        );


        return res.status(201).json({

            sucesso: true,

            mensagem:
                'Produto cadastrado com sucesso!',

            id:
                resultado.insertId

        });


    } catch (erro) {

        console.error(
            'Erro ao cadastrar produto:',
            erro
        );


        // -------------------------------------------------
        // CASO O MYSQL POSSUA RESTRIÇÃO UNIQUE
        // -------------------------------------------------

        if (erro.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({

                sucesso: false,

                mensagem:
                    'Este produto já está cadastrado.'

            });

        }


        return res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao cadastrar produto.',

            erro:
                erro.message

        });

    }

});


// =====================================================
// LISTAR TODOS OS PRODUTOS
// GET /api/produtos
// =====================================================

router.get('/', async (req, res) => {

    try {

        // -------------------------------------------------
        // IMPORTANTE:
        //
        // A tabela atual possui somente:
        //
        // id
        // nome
        // categoria
        // unidade
        //
        // Portanto não buscamos preco, quantidade,
        // data_cadastro etc.
        // -------------------------------------------------

        const [produtos] = await banco.query(

            `
            SELECT
                id,
                nome,
                categoria,
                unidade

            FROM produtos

            ORDER BY nome ASC
            `

        );


        // -------------------------------------------------
        // FORMATAR PARA O FRONTEND
        // -------------------------------------------------
        //
        // cadastro.js trabalha com categoria_id.
        //
        // Portanto transformamos:
        //
        // "Refrigerantes"
        //
        // em:
        //
        // categoria_id: 3
        // -------------------------------------------------

        const produtosFormatados = produtos.map(produto => ({

            id:
                produto.id,

            nome:
                produto.nome,

            categoria:
                produto.categoria,

            categoria_id:
                obterCategoriaId(produto.categoria),

            unidade:
                produto.unidade,

            // O banco atual não possui coluna estoque.
            // A interface possui essa coluna.
            estoque:
                0

        }));


        return res.json({

            sucesso: true,

            produtos:
                produtosFormatados

        });


    } catch (erro) {

        console.error(
            'Erro ao buscar produtos:',
            erro
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar produtos.',

            erro:
                erro.message

        });

    }

});


// =====================================================
// BUSCAR PRODUTO POR ID
// GET /api/produtos/:id
// =====================================================

router.get('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const [produtos] = await banco.query(

            `
            SELECT
                id,
                nome,
                categoria,
                unidade

            FROM produtos

            WHERE id = ?
            `,

            [id]

        );


        // -------------------------------------------------
        // PRODUTO NÃO ENCONTRADO
        // -------------------------------------------------

        if (produtos.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }


        const produto =
            produtos[0];


        // -------------------------------------------------
        // FORMATAR PRODUTO PARA O FRONTEND
        // -------------------------------------------------

        const produtoFormatado = {

            id:
                produto.id,

            nome:
                produto.nome,

            categoria:
                produto.categoria,

            categoria_id:
                obterCategoriaId(produto.categoria),

            unidade:
                produto.unidade,

            estoque:
                0

        };


        return res.json({

            sucesso: true,

            produto:
                produtoFormatado

        });


    } catch (erro) {

        console.error(
            'Erro ao buscar produto:',
            erro
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao buscar produto.',

            erro:
                erro.message

        });

    }

});


// =====================================================
// EDITAR PRODUTO
// PUT /api/produtos/:id
// =====================================================

router.put('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const {
            nome,
            categoria_id,
            unidade
        } = req.body;


        // -------------------------------------------------
        // VALIDAR CAMPOS
        // -------------------------------------------------

        if (!nome || !categoria_id || !unidade) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Preencha todos os campos do produto.'

            });

        }


        const nomeLimpo =
            String(nome).trim();

        const unidadeLimpa =
            String(unidade).trim();

        const categoriaNome =
            obterCategoria(categoria_id);


        // -------------------------------------------------
        // VALIDAR CATEGORIA
        // -------------------------------------------------

        if (!categoriaNome) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    'Categoria inválida.'

            });

        }


        // -------------------------------------------------
        // VERIFICAR DUPLICIDADE NA EDIÇÃO
        // -------------------------------------------------
        //
        // O "id <> ?" é importante.
        //
        // Ele impede que o próprio produto seja
        // considerado uma duplicidade.
        // -------------------------------------------------

        const [produtoExistente] = await banco.query(

            `
            SELECT id
            FROM produtos

            WHERE LOWER(TRIM(nome)) = LOWER(?)
              AND LOWER(TRIM(categoria)) = LOWER(?)
              AND LOWER(TRIM(unidade)) = LOWER(?)
              AND id <> ?

            LIMIT 1
            `,

            [
                nomeLimpo,
                categoriaNome,
                unidadeLimpa,
                id
            ]

        );


        if (produtoExistente.length > 0) {

            return res.status(409).json({

                sucesso: false,

                mensagem:
                    'Já existe outro produto com estes dados.'

            });

        }


        // -------------------------------------------------
        // ATUALIZAR PRODUTO
        // -------------------------------------------------

        const [resultado] = await banco.query(

            `
            UPDATE produtos

            SET
                nome = ?,
                categoria = ?,
                unidade = ?

            WHERE id = ?
            `,

            [
                nomeLimpo,
                categoriaNome,
                unidadeLimpa,
                id
            ]

        );


        // -------------------------------------------------
        // VERIFICAR SE O PRODUTO EXISTE
        // -------------------------------------------------

        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }


        return res.json({

            sucesso: true,

            mensagem:
                'Produto editado com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao editar produto:',
            erro
        );


        if (erro.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({

                sucesso: false,

                mensagem:
                    'Já existe outro produto com estes dados.'

            });

        }


        return res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao editar produto.',

            erro:
                erro.message

        });

    }

});


// =====================================================
// EXCLUIR PRODUTO
// DELETE /api/produtos/:id
// =====================================================

router.delete('/:id', async (req, res) => {

    try {

        const { id } =
            req.params;


        const [resultado] = await banco.query(

            `
            DELETE FROM produtos
            WHERE id = ?
            `,

            [id]

        );


        // -------------------------------------------------
        // PRODUTO NÃO ENCONTRADO
        // -------------------------------------------------

        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    'Produto não encontrado.'

            });

        }


        return res.json({

            sucesso: true,

            mensagem:
                'Produto excluído com sucesso!'

        });


    } catch (erro) {

        console.error(
            'Erro ao excluir produto:',
            erro
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                'Erro ao excluir produto.',

            erro:
                erro.message

        });

    }

});


module.exports = router;
