// ========================================
// ELEMENTOS - PRODUTOS
// ========================================

const produtoSelecionado =
    document.querySelector('#produtoSelecionado');

const nomeProduto =
    document.querySelector('#nomeProduto');

const categoria =
    document.querySelector('#categoria');

const unidade =
    document.querySelector('#unidade');

const btnCadastrarProduto =
    document.querySelector('#btnCadastrarProduto');

const btnEditarProduto =
    document.querySelector('#btnEditarProduto');

const btnExcluirProduto =
    document.querySelector('#btnExcluirProduto');


// ========================================
// CARREGAR PRODUTOS
// ========================================

async function carregarProdutos() {

    try {

        const resposta = await fetch('/api/produtos');

        const dados = await resposta.json();


        produtoSelecionado.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;


        if (!dados.sucesso) {

            console.error(
                'Erro ao carregar produtos:',
                dados.mensagem
            );

            return;
        }


        dados.produtos.forEach(produto => {

            const option =
                document.createElement('option');

            option.value = produto.id;

            option.textContent = produto.nome;

            produtoSelecionado.appendChild(option);

        });

    } catch (erro) {

        console.error(
            'Erro ao carregar produtos:',
            erro
        );

    }

}


// ========================================
// SELECIONAR PRODUTO
// ========================================

produtoSelecionado.addEventListener(
    'change',
    async () => {

        const id = produtoSelecionado.value;


        if (!id) {

            limparCamposProduto();

            return;

        }


        try {

            const resposta = await fetch(
                `/api/produtos/${id}`
            );

            const dados = await resposta.json();


            if (!dados.sucesso) {

                alert(dados.mensagem);

                return;

            }


            const produto = dados.produto;


            nomeProduto.value =
                produto.nome;

            categoria.value =
                produto.categoria;

            unidade.value =
                produto.unidade;


        } catch (erro) {

            console.error(
                'Erro ao buscar produto:',
                erro
            );

            alert(
                'Erro ao carregar os dados do produto.'
            );

        }

    }
);


// ========================================
// CADASTRAR PRODUTO
// ========================================

btnCadastrarProduto.addEventListener(
    'click',
    async () => {

        const nome =
            nomeProduto.value.trim();

        const categoriaValor =
            categoria.value;

        const unidadeValor =
            unidade.value;


        if (
            !nome ||
            categoriaValor === 'Selecione' ||
            unidadeValor === 'Selecione'
        ) {

            alert(
                'Preencha todos os campos do produto.'
            );

            return;

        }


        try {

            const resposta = await fetch(
                '/api/produtos',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        nome: nome,

                        categoria:
                            categoriaValor,

                        unidade:
                            unidadeValor

                    })

                }
            );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(dados.mensagem);

                return;

            }


            alert(
                'Produto cadastrado com sucesso!'
            );


            limparProduto();


            await carregarProdutos();


        } catch (erro) {

            console.error(
                'Erro ao cadastrar produto:',
                erro
            );

            alert(
                'Erro ao cadastrar produto.'
            );

        }

    }
);


// ========================================
// EDITAR PRODUTO
// ========================================

btnEditarProduto.addEventListener(
    'click',
    async () => {

        const id =
            produtoSelecionado.value;


        if (!id) {

            alert(
                'Selecione um produto para editar.'
            );

            return;

        }


        const nome =
            nomeProduto.value.trim();

        const categoriaValor =
            categoria.value;

        const unidadeValor =
            unidade.value;


        if (
            !nome ||
            categoriaValor === 'Selecione' ||
            unidadeValor === 'Selecione'
        ) {

            alert(
                'Preencha todos os campos do produto.'
            );

            return;

        }


        try {

            const resposta = await fetch(
                `/api/produtos/${id}`,
                {

                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        nome: nome,

                        categoria:
                            categoriaValor,

                        unidade:
                            unidadeValor

                    })

                }
            );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(dados.mensagem);

                return;

            }


            alert(
                'Produto editado com sucesso!'
            );


            limparProduto();


            await carregarProdutos();


        } catch (erro) {

            console.error(
                'Erro ao editar produto:',
                erro
            );

            alert(
                'Erro ao editar produto.'
            );

        }

    }
);


// ========================================
// EXCLUIR PRODUTO
// ========================================

btnExcluirProduto.addEventListener(
    'click',
    async () => {

        const id =
            produtoSelecionado.value;


        // Verifica se existe produto selecionado
        if (!id) {

            alert(
                'Selecione um produto para excluir.'
            );

            return;

        }


        // Nome utilizado na confirmação
        const nome =
            nomeProduto.value;


        // Confirmação antes de excluir
        const confirmar = confirm(
            `Tem certeza que deseja excluir o produto "${nome}"?`
        );


        // Usuário clicou em cancelar
        if (!confirmar) {

            return;

        }


        try {

            const resposta = await fetch(
                `/api/produtos/${id}`,
                {

                    method: 'DELETE'

                }
            );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(dados.mensagem);

                return;

            }


            alert(
                'Produto excluído com sucesso!'
            );


            // Limpa os campos
            limparProduto();


            // Atualiza a lista
            await carregarProdutos();


        } catch (erro) {

            console.error(
                'Erro ao excluir produto:',
                erro
            );


            alert(
                'Erro ao excluir produto.'
            );

        }

    }
);


// ========================================
// LIMPAR PRODUTO
// ========================================

function limparProduto() {

    produtoSelecionado.value = '';

    limparCamposProduto();

}


function limparCamposProduto() {

    nomeProduto.value = '';

    categoria.value = 'Selecione';

    unidade.value = 'Selecione';

}


// ========================================
// FORNECEDOR
// ========================================

const btnCadastrarFornecedor =
    document.querySelector(
        '#btnCadastrarFornecedor'
    );


if (btnCadastrarFornecedor) {

    btnCadastrarFornecedor.addEventListener(
        'click',
        () => {

            const empresa =
                document.querySelector(
                    '#empresa'
                ).value.trim();

            const cnpj =
                document.querySelector(
                    '#cnpj'
                ).value.trim();


            if (!empresa || !cnpj) {

                alert(
                    'Preencha a empresa e o CNPJ.'
                );

                return;

            }


            alert(
                'Fornecedor cadastrado com sucesso!'
            );


            document.querySelector(
                '#empresa'
            ).value = '';

            document.querySelector(
                '#cnpj'
            ).value = '';

            document.querySelector(
                '#telefone'
            ).value = '';

            document.querySelector(
                '#consultor'
            ).value = '';

            document.querySelector(
                '#email'
            ).value = '';

            document.querySelector(
                '#dataCadastro'
            ).value = '';

        }
    );

}


// ========================================
// INICIALIZAÇÃO
// ========================================

// Busca os produtos do MySQL quando
// cadastros.html é aberto.
carregarProdutos();
