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
// ELEMENTOS - FILTROS DE PRODUTOS
// ========================================

const filtroNome =
    document.querySelector('#filtroNome');

const filtroCategoria =
    document.querySelector('#filtroCategoria');

const filtroUnidade =
    document.querySelector('#filtroUnidade');


// Guarda todos os produtos carregados do banco

let listaProdutos = [];


// ========================================
// CARREGAR PRODUTOS
// ========================================

async function carregarProdutos() {

    try {

        const resposta =
            await fetch('/api/produtos');


        const dados =
            await resposta.json();


        if (!dados.sucesso) {

            console.error(
                'Erro ao carregar produtos:',
                dados.mensagem
            );

            return;

        }


        // Guarda todos os produtos
        // recebidos do banco.

        listaProdutos =
            dados.produtos;


        // Aplica os filtros atuais.

        filtrarProdutos();


    } catch (erro) {

        console.error(
            'Erro ao carregar produtos:',
            erro
        );

    }

}


// ========================================
// EXIBIR PRODUTOS NO SELECT
// ========================================

function exibirProdutos(produtos) {

    produtoSelecionado.innerHTML = `
        <option value="">
            Selecione um produto
        </option>
    `;


    produtos.forEach(produto => {

        const option =
            document.createElement('option');


        option.value =
            produto.id;


        option.textContent =
            produto.nome;


        produtoSelecionado.appendChild(
            option
        );

    });


    // Caso nenhum produto seja encontrado.

    if (produtos.length === 0) {

        const option =
            document.createElement('option');


        option.value = '';

        option.textContent =
            'Nenhum produto encontrado';


        produtoSelecionado.appendChild(
            option
        );

    }

}


// ========================================
// FILTRAR PRODUTOS
// ========================================

function filtrarProdutos() {

    const nomeFiltro =
        filtroNome.value
            .trim()
            .toLowerCase();


    const categoriaFiltro =
        filtroCategoria.value;


    const unidadeFiltro =
        filtroUnidade.value;


    const produtosFiltrados =
        listaProdutos.filter(produto => {


            // FILTRO POR NOME

            const correspondeNome =
                String(
                    produto.nome || ''
                )
                    .toLowerCase()
                    .includes(
                        nomeFiltro
                    );


            // FILTRO POR CATEGORIA

            const correspondeCategoria =
                !categoriaFiltro ||
                produto.categoria ===
                    categoriaFiltro;


            // FILTRO POR UNIDADE

            const correspondeUnidade =
                !unidadeFiltro ||
                produto.unidade ===
                    unidadeFiltro;


            // Produto precisa atender
            // todos os filtros.

            return (
                correspondeNome &&
                correspondeCategoria &&
                correspondeUnidade
            );

        });


    exibirProdutos(
        produtosFiltrados
    );

}


// ========================================
// EVENTOS DOS FILTROS
// ========================================

// Pesquisa enquanto o usuário digita.

filtroNome.addEventListener(
    'input',
    filtrarProdutos
);


// Filtra quando categoria é alterada.

filtroCategoria.addEventListener(
    'change',
    filtrarProdutos
);


// Filtra quando unidade é alterada.

filtroUnidade.addEventListener(
    'change',
    filtrarProdutos
);


// ========================================
// SELECIONAR PRODUTO
// ========================================

produtoSelecionado.addEventListener(
    'change',
    async () => {

        const id =
            produtoSelecionado.value;


        if (!id) {

            limparCamposProduto();

            return;

        }


        try {

            const resposta =
                await fetch(
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
                produto.nome || '';


            categoria.value =
                produto.categoria || '';


            unidade.value =
                produto.unidade || '';


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
// VALIDAR CAMPOS DO PRODUTO
// ========================================

function validarProduto() {

    const nome =
        nomeProduto.value.trim();

    const categoriaValor =
        categoria.value;

    const unidadeValor =
        unidade.value;


    // NOME

    if (!nome) {

        alert(
            'O nome do produto é obrigatório.'
        );

        nomeProduto.focus();

        return false;

    }


    // CATEGORIA

    if (!categoriaValor) {

        alert(
            'Selecione uma categoria.'
        );

        categoria.focus();

        return false;

    }


    // UNIDADE

    if (!unidadeValor) {

        alert(
            'Selecione uma unidade de medida.'
        );

        unidade.focus();

        return false;

    }


    return true;

}


// ========================================
// CADASTRAR PRODUTO
// ========================================

btnCadastrarProduto.addEventListener(
    'click',
    async () => {

        // ====================================
        // VALIDAÇÃO
        // ====================================

        if (!validarProduto()) {

            return;

        }


        const nome =
            nomeProduto.value.trim();

        const categoriaValor =
            categoria.value;

        const unidadeValor =
            unidade.value;


        // ====================================
        // ENVIA PARA O BACKEND
        // ====================================

        try {

            const resposta =
                await fetch(
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

                alert(
                    dados.mensagem ||
                    'Erro ao cadastrar produto.'
                );

                return;

            }


            alert(
                'Produto cadastrado com sucesso!'
            );


            limparProduto();


            // Atualiza a lista após cadastrar.

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


        // ====================================
        // VERIFICAR PRODUTO SELECIONADO
        // ====================================

        if (!id) {

            alert(
                'Selecione um produto para editar.'
            );

            produtoSelecionado.focus();

            return;

        }


        // ====================================
        // VALIDAR CAMPOS
        // ====================================

        if (!validarProduto()) {

            return;

        }


        const nome =
            nomeProduto.value.trim();

        const categoriaValor =
            categoria.value;

        const unidadeValor =
            unidade.value;


        // ====================================
        // ATUALIZAR PRODUTO
        // ====================================

        try {

            const resposta =
                await fetch(
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

                alert(
                    dados.mensagem ||
                    'Erro ao editar produto.'
                );

                return;

            }


            alert(
                'Produto editado com sucesso!'
            );


            limparProduto();


            // Atualiza os produtos e
            // reaplica os filtros.

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


        if (!id) {

            alert(
                'Selecione um produto para excluir.'
            );

            produtoSelecionado.focus();

            return;

        }


        const nome =
            nomeProduto.value;


        const confirmar =
            confirm(
                `Tem certeza que deseja excluir o produto "${nome}"?`
            );


        if (!confirmar) {

            return;

        }


        try {

            const resposta =
                await fetch(
                    `/api/produtos/${id}`,
                    {

                        method: 'DELETE'

                    }
                );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(
                    dados.mensagem ||
                    'Erro ao excluir produto.'
                );

                return;

            }


            alert(
                'Produto excluído com sucesso!'
            );


            limparProduto();


            // Atualiza a lista depois
            // da exclusão.

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

    categoria.value = '';

    unidade.value = '';

}


// ========================================
// ELEMENTOS - FORNECEDORES
// ========================================

const fornecedorSelecionado =
    document.querySelector(
        '#fornecedorSelecionado'
    );

const empresa =
    document.querySelector(
        '#empresa'
    );

const cnpj =
    document.querySelector(
        '#cnpj'
    );

const telefone =
    document.querySelector(
        '#telefone'
    );

const consultor =
    document.querySelector(
        '#consultor'
    );

const email =
    document.querySelector(
        '#email'
    );

const dataCadastro =
    document.querySelector(
        '#dataCadastro'
    );

const btnCadastrarFornecedor =
    document.querySelector(
        '#btnCadastrarFornecedor'
    );

const btnEditarFornecedor =
    document.querySelector(
        '#btnEditarFornecedor'
    );

const btnExcluirFornecedor =
    document.querySelector(
        '#btnExcluirFornecedor'
    );


// ========================================
// CARREGAR FORNECEDORES
// ========================================

async function carregarFornecedores() {

    try {

        const resposta =
            await fetch(
                '/api/fornecedores'
            );


        const dados =
            await resposta.json();


        fornecedorSelecionado.innerHTML = `
            <option value="">
                Selecione um fornecedor
            </option>
        `;


        if (!dados.sucesso) {

            console.error(
                'Erro ao carregar fornecedores:',
                dados.mensagem
            );

            return;

        }


        dados.fornecedores.forEach(
            fornecedor => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    fornecedor.id;


                option.textContent =
                    fornecedor.empresa;


                fornecedorSelecionado.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar fornecedores:',
            erro
        );

    }

}


// ========================================
// SELECIONAR FORNECEDOR
// ========================================

fornecedorSelecionado.addEventListener(
    'change',
    async () => {

        const id =
            fornecedorSelecionado.value;


        if (!id) {

            limparCamposFornecedor();

            return;

        }


        try {

            const resposta =
                await fetch(
                    `/api/fornecedores/${id}`
                );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(
                    dados.mensagem
                );

                return;

            }


            const fornecedor =
                dados.fornecedor;


            empresa.value =
                fornecedor.empresa || '';


            cnpj.value =
                fornecedor.CNPJ ||
                fornecedor.cnpj ||
                '';


            telefone.value =
                fornecedor.telefone || '';


            consultor.value =
                fornecedor.consultor || '';


            email.value =
                fornecedor.email || '';


            if (
                fornecedor.data_cadastro
            ) {

                dataCadastro.value =
                    String(
                        fornecedor.data_cadastro
                    ).substring(0, 10);

            } else {

                dataCadastro.value = '';

            }


        } catch (erro) {

            console.error(
                'Erro ao buscar fornecedor:',
                erro
            );


            alert(
                'Erro ao carregar os dados do fornecedor.'
            );

        }

    }
);


// ========================================
// CADASTRAR FORNECEDOR
// ========================================

btnCadastrarFornecedor.addEventListener(
    'click',
    async () => {

        const empresaValor =
            empresa.value.trim();

        const cnpjValor =
            cnpj.value.trim();

        const telefoneValor =
            telefone.value.trim();

        const consultorValor =
            consultor.value.trim();

        const emailValor =
            email.value.trim();

        const dataCadastroValor =
            dataCadastro.value;


        if (
            !empresaValor ||
            !cnpjValor
        ) {

            alert(
                'Preencha a empresa e o CNPJ.'
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    '/api/fornecedores',
                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'

                        },

                        body: JSON.stringify({

                            empresa:
                                empresaValor,

                            cnpj:
                                cnpjValor,

                            telefone:
                                telefoneValor,

                            consultor:
                                consultorValor,

                            email:
                                emailValor,

                            data_cadastro:
                                dataCadastroValor

                        })

                    }
                );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(
                    dados.mensagem
                );

                return;

            }


            alert(
                'Fornecedor cadastrado com sucesso!'
            );


            limparFornecedor();


            await carregarFornecedores();


        } catch (erro) {

            console.error(
                'Erro ao cadastrar fornecedor:',
                erro
            );


            alert(
                'Erro ao cadastrar fornecedor.'
            );

        }

    }
);


// ========================================
// EDITAR FORNECEDOR
// ========================================

btnEditarFornecedor.addEventListener(
    'click',
    async () => {

        const id =
            fornecedorSelecionado.value;


        if (!id) {

            alert(
                'Selecione um fornecedor para editar.'
            );

            return;

        }


        const empresaValor =
            empresa.value.trim();

        const cnpjValor =
            cnpj.value.trim();

        const telefoneValor =
            telefone.value.trim();

        const consultorValor =
            consultor.value.trim();

        const emailValor =
            email.value.trim();

        const dataCadastroValor =
            dataCadastro.value;


        if (
            !empresaValor ||
            !cnpjValor
        ) {

            alert(
                'Preencha a empresa e o CNPJ.'
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    `/api/fornecedores/${id}`,
                    {

                        method: 'PUT',

                        headers: {

                            'Content-Type':
                                'application/json'

                        },

                        body: JSON.stringify({

                            empresa:
                                empresaValor,

                            cnpj:
                                cnpjValor,

                            telefone:
                                telefoneValor,

                            consultor:
                                consultorValor,

                            email:
                                emailValor,

                            data_cadastro:
                                dataCadastroValor

                        })

                    }
                );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(
                    dados.mensagem
                );

                return;

            }


            alert(
                'Fornecedor editado com sucesso!'
            );


            limparFornecedor();


            await carregarFornecedores();


        } catch (erro) {

            console.error(
                'Erro ao editar fornecedor:',
                erro
            );


            alert(
                'Erro ao editar fornecedor.'
            );

        }

    }
);


// ========================================
// EXCLUIR FORNECEDOR
// ========================================

btnExcluirFornecedor.addEventListener(
    'click',
    async () => {

        const id =
            fornecedorSelecionado.value;


        if (!id) {

            alert(
                'Selecione um fornecedor para excluir.'
            );

            return;

        }


        const nomeEmpresa =
            empresa.value;


        const confirmar =
            confirm(
                `Tem certeza que deseja excluir o fornecedor "${nomeEmpresa}"?`
            );


        if (!confirmar) {

            return;

        }


        try {

            const resposta =
                await fetch(
                    `/api/fornecedores/${id}`,
                    {

                        method: 'DELETE'

                    }
                );


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                alert(
                    dados.mensagem
                );

                return;

            }


            alert(
                'Fornecedor excluído com sucesso!'
            );


            limparFornecedor();


            await carregarFornecedores();


        } catch (erro) {

            console.error(
                'Erro ao excluir fornecedor:',
                erro
            );


            alert(
                'Erro ao excluir fornecedor.'
            );

        }

    }
);


// ========================================
// LIMPAR FORNECEDOR
// ========================================

function limparFornecedor() {

    fornecedorSelecionado.value = '';

    limparCamposFornecedor();

}


function limparCamposFornecedor() {

    empresa.value = '';

    cnpj.value = '';

    telefone.value = '';

    consultor.value = '';

    email.value = '';

    dataCadastro.value = '';

}


// ========================================
// INICIALIZAÇÃO
// ========================================

// Busca produtos e fornecedores
// no MySQL quando cadastros.html é aberto.

carregarProdutos();

carregarFornecedores();
