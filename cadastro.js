// ========================================
// PRODUTOS
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


// ----------------------------------------
// CARREGAR PRODUTOS
// ----------------------------------------

async function carregarProdutos() {

    try {

        const resposta = await fetch(
            '/api/produtos'
        );

        const dados = await resposta.json();

        produtoSelecionado.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;

        if (!dados.sucesso) {
            return;
        }

        dados.produtos.forEach(produto => {

            const option =
                document.createElement('option');

            option.value = produto.id;

            option.textContent =
                produto.nome;

            produtoSelecionado.appendChild(
                option
            );
        });

    } catch (erro) {

        console.error(
            'Erro ao carregar produtos:',
            erro
        );
    }
}


// ----------------------------------------
// SELECIONAR PRODUTO
// ----------------------------------------

produtoSelecionado.addEventListener(
    'change',
    async () => {

        const id =
            produtoSelecionado.value;

        if (!id) {

            limparProduto();

            return;
        }

        try {

            const resposta = await fetch(
                `/api/produtos/${id}`
            );

            const dados =
                await resposta.json();

            if (!dados.sucesso) {

                alert(
                    dados.mensagem
                );

                return;
            }

            const produto =
                dados.produto;

            nomeProduto.value =
                produto.nome;

            categoria.value =
                produto.categoria;

            unidade.value =
                produto.unidade;

        } catch (erro) {

            console.error(erro);

            alert(
                'Erro ao carregar produto.'
            );
        }
    }
);


// ----------------------------------------
// CADASTRAR PRODUTO
// ----------------------------------------

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
                        categoria: categoriaValor,
                        unidade: unidadeValor
                    })
                }
            );

            const dados =
                await resposta.json();

            alert(dados.mensagem);

            if (dados.sucesso) {

                limparProduto();

                await carregarProdutos();
            }

        } catch (erro) {

            console.error(erro);

            alert(
                'Erro ao cadastrar produto.'
            );
        }
    }
);


// ----------------------------------------
// EDITAR PRODUTO
// ----------------------------------------

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
                'Preencha todos os campos.'
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
                        categoria: categoriaValor,
                        unidade: unidadeValor
                    })
                }
            );

            const dados =
                await resposta.json();

            alert(dados.mensagem);

            if (dados.sucesso) {

                limparProduto();

                await carregarProdutos();
            }

        } catch (erro) {

            console.error(erro);

            alert(
                'Erro ao editar produto.'
            );
        }
    }
);


// ----------------------------------------
// EXCLUIR PRODUTO
// ----------------------------------------

btnExcluirProduto.addEventListener(
    'click',
    async () => {

        const id =
            produtoSelecionado.value;

        if (!id) {

            alert(
                'Selecione um produto para excluir.'
            );

            return;
        }

        const confirmar =
            confirm(
                'Tem certeza que deseja excluir este produto?'
            );

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

            alert(dados.mensagem);

            if (dados.sucesso) {

                limparProduto();

                await carregarProdutos();
            }

        } catch (erro) {

            console.error(erro);

            alert(
                'Erro ao excluir produto.'
            );
        }
    }
);


// ----------------------------------------
// LIMPAR CAMPOS
// ----------------------------------------

function limparProduto() {

    produtoSelecionado.value = '';

    nomeProduto.value = '';

    categoria.value =
        'Selecione';

    unidade.value =
        'Selecione';
}


// ========================================
// FORNECEDORES
// ========================================

const btnCadastrarFornecedor =
    document.querySelector(
        '#btnCadastrarFornecedor'
    );

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


// Carrega os produtos quando a página abrir
carregarProdutos();
