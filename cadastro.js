console.log('CADASTRO.JS CARREGADO');


// ==================================================
// PRODUTOS
// ==================================================

const nomeProduto =
    document.querySelector('#nomeProduto');

const categoria =
    document.querySelector('#categoria');

const unidade =
    document.querySelector('#unidade');

const btnCadastrarProduto =
    document.querySelector('#btnCadastrarProduto');

const filtroNome =
    document.querySelector('#filtroNome');

const filtroCategoria =
    document.querySelector('#filtroCategoria');

const filtroUnidade =
    document.querySelector('#filtroUnidade');

const listaProdutos =
    document.querySelector('#listaProdutos');


// Lista completa de produtos

let produtosCadastrados = [];


// ==================================================
// NOMES DAS CATEGORIAS
// ==================================================

const categorias = {

    5: 'Água',

    2: 'Cervejas',

    4: 'Destilados',

    6: 'Gelo',

    7: 'Outros',

    3: 'Refrigerantes',

    1: 'Sucos'

};


// ==================================================
// CARREGAR PRODUTOS
// ==================================================

async function carregarProdutos() {

    try {

        const resposta =
            await fetch('/api/produtos');


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            console.error(
                'Erro ao carregar produtos:',
                dados
            );


            listaProdutos.innerHTML = `

                <tr>

                    <td colspan="4">

                        Não foi possível carregar os produtos.

                    </td>

                </tr>

            `;


            return;

        }


        produtosCadastrados =
            dados.produtos || [];


        exibirProdutos(
            produtosCadastrados
        );


    } catch (erro) {


        console.error(
            'Erro ao carregar produtos:',
            erro
        );


        listaProdutos.innerHTML = `

            <tr>

                <td colspan="4">

                    Não foi possível conectar ao servidor.

                </td>

            </tr>

        `;

    }

}


// ==================================================
// MOSTRAR PRODUTOS NA TABELA
// ==================================================

function exibirProdutos(produtos) {

    listaProdutos.innerHTML = '';


    if (
        !produtos ||
        produtos.length === 0
    ) {

        listaProdutos.innerHTML = `

            <tr>

                <td colspan="4">

                    Nenhum produto encontrado.

                </td>

            </tr>

        `;


        return;

    }


    produtos.forEach(
        produto => {


            const tr =
                document.createElement('tr');


            // ------------------------------------------
            // CATEGORIA
            // ------------------------------------------

            let nomeCategoria =
                categorias[
                    produto.categoria_id
                ];


            // Caso o backend já envie
            // o nome da categoria

            if (produto.categoria) {

                nomeCategoria =
                    produto.categoria;

            }


            if (!nomeCategoria) {

                nomeCategoria =
                    'Não informada';

            }


            // ------------------------------------------
            // ESTOQUE
            // ------------------------------------------

            const estoque =

                produto.estoque !== undefined &&
                produto.estoque !== null

                    ? produto.estoque

                    : '0';


            tr.innerHTML = `

                <td>
                    ${produto.nome}
                </td>

                <td>
                    ${nomeCategoria}
                </td>

                <td>
                    ${produto.unidade}
                </td>

                <td>
                    ${estoque}
                </td>

            `;


            listaProdutos.appendChild(
                tr
            );

        }
    );

}


// ==================================================
// FILTRAR PRODUTOS
// ==================================================

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

        produtosCadastrados.filter(

            produto => {


                // --------------------------------------
                // FILTRO POR NOME
                // --------------------------------------

                const nomeProdutoAtual =

                    (
                        produto.nome || ''
                    ).toLowerCase();


                const correspondeNome =

                    nomeProdutoAtual.includes(
                        nomeFiltro
                    );


                // --------------------------------------
                // FILTRO POR CATEGORIA
                // --------------------------------------

                const correspondeCategoria =

                    !categoriaFiltro ||

                    String(
                        produto.categoria_id
                    ) ===
                    String(
                        categoriaFiltro
                    );


                // --------------------------------------
                // FILTRO POR UNIDADE
                // --------------------------------------

                const correspondeUnidade =

                    !unidadeFiltro ||

                    produto.unidade ===
                        unidadeFiltro;


                return (

                    correspondeNome &&

                    correspondeCategoria &&

                    correspondeUnidade

                );

            }

        );


    exibirProdutos(
        produtosFiltrados
    );

}


// ==================================================
// EVENTOS DOS FILTROS
// ==================================================

if (filtroNome) {

    filtroNome.addEventListener(
        'input',
        filtrarProdutos
    );

}


if (filtroCategoria) {

    filtroCategoria.addEventListener(
        'change',
        filtrarProdutos
    );

}


if (filtroUnidade) {

    filtroUnidade.addEventListener(
        'change',
        filtrarProdutos
    );

}


// ==================================================
// CADASTRAR PRODUTO
// ==================================================

if (btnCadastrarProduto) {


    btnCadastrarProduto.addEventListener(

        'click',

        async () => {


            const nome =
                nomeProduto.value.trim();


            const categoria_id =
                categoria.value;


            const unidadeValor =
                unidade.value;


            // ==========================================
            // VALIDAÇÕES
            // ==========================================

            if (!nome) {


                alert(
                    'Preencha o nome do produto.'
                );


                nomeProduto.focus();


                return;

            }


            if (!categoria_id) {


                alert(
                    'Selecione uma categoria.'
                );


                categoria.focus();


                return;

            }


            if (!unidadeValor) {


                alert(
                    'Selecione a unidade de medida.'
                );


                unidade.focus();


                return;

            }


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


                            body:
                                JSON.stringify({

                                    nome,

                                    categoria_id,

                                    unidade:
                                        unidadeValor

                                })

                        }

                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {


                    console.error(

                        'Erro retornado pelo servidor:',

                        dados

                    );


                    alert(

                        dados.mensagem ||

                        'Erro ao cadastrar produto.'

                    );


                    return;

                }


                // ======================================
                // MENSAGEM DE SUCESSO
                // ======================================

                alert(

                    dados.mensagem ||

                    'Produto cadastrado com sucesso!'

                );


                // ======================================
                // LIMPAR CAMPOS
                // ======================================

                nomeProduto.value = '';

                categoria.value = '';

                unidade.value = '';


                // Volta o cursor para o primeiro campo.

                nomeProduto.focus();


                // ======================================
                // ATUALIZAR TABELA
                // ======================================

                await carregarProdutos();


            } catch (erro) {


                console.error(

                    'Erro ao cadastrar produto:',

                    erro

                );


                alert(

                    'Não foi possível conectar ao servidor.'

                );

            }

        }

    );

}


// ==================================================
// FORNECEDORES
// ==================================================

const empresa =
    document.querySelector('#empresa');


const cnpj =
    document.querySelector('#cnpj');


const telefone =
    document.querySelector('#telefone');


const consultor =
    document.querySelector('#consultor');


const email =
    document.querySelector('#email');


const dataCadastro =
    document.querySelector(
        '#dataCadastro'
    );


const btnCadastrarFornecedor =

    document.querySelector(
        '#btnCadastrarFornecedor'
    );


// ==================================================
// CADASTRAR FORNECEDOR
// ==================================================

if (btnCadastrarFornecedor) {


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


            // ==========================================
            // VALIDAÇÕES
            // ==========================================

            if (!empresaValor) {


                alert(
                    'Preencha o nome da empresa.'
                );


                empresa.focus();


                return;

            }


            if (!cnpjValor) {


                alert(
                    'Preencha o CNPJ.'
                );


                cnpj.focus();


                return;

            }


            // Remove pontos, barras e traços
            // para conferir a quantidade de números.

            const cnpjNumeros =

                cnpjValor.replace(
                    /\D/g,
                    ''
                );


            if (
                cnpjNumeros.length !== 14
            ) {


                alert(
                    'Informe um CNPJ com 14 dígitos.'
                );


                cnpj.focus();


                return;

            }


            // ------------------------------------------
            // VALIDAR E-MAIL
            // ------------------------------------------

            if (
                emailValor &&
                !email.checkValidity()
            ) {


                alert(
                    'Informe um e-mail válido.'
                );


                email.focus();


                return;

            }


            // ------------------------------------------
            // VALIDAR DATA
            // ------------------------------------------

            if (!dataCadastroValor) {


                alert(
                    'Informe a data de cadastro.'
                );


                dataCadastro.focus();


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


                            body:
                                JSON.stringify({

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
                                        dataCadastroValor ||
                                        null

                                })

                        }

                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {


                    console.error(

                        'Erro retornado pelo servidor:',

                        dados

                    );


                    alert(

                        dados.mensagem ||

                        'Erro ao cadastrar fornecedor.'

                    );


                    return;

                }


                // ======================================
                // MENSAGEM DE SUCESSO
                // ======================================

                alert(

                    dados.mensagem ||

                    'Fornecedor cadastrado com sucesso!'

                );


                // ======================================
                // LIMPAR CAMPOS
                // ======================================

                empresa.value = '';

                cnpj.value = '';

                telefone.value = '';

                consultor.value = '';

                email.value = '';


                // Mantém a data atual pronta
                // para o próximo cadastro.

                dataCadastro.value =
                    obterDataAtual();


                // Volta o foco para o primeiro campo.

                empresa.focus();


            } catch (erro) {


                console.error(

                    'Erro ao cadastrar fornecedor:',

                    erro

                );


                alert(

                    'Não foi possível conectar ao servidor.'

                );

            }

        }

    );

}


// ==================================================
// MELHORIAS DE USABILIDADE
// ==================================================


// ==================================================
// OBTER DATA ATUAL
// ==================================================

function obterDataAtual() {


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            '0'
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            '0'
        );


    return `${ano}-${mes}-${dia}`;

}


// ==================================================
// MÁSCARA DE CNPJ
// ==================================================

function aplicarMascaraCNPJ(valor) {


    let numeros =

        valor
            .replace(
                /\D/g,
                ''
            )
            .slice(
                0,
                14
            );


    numeros =
        numeros.replace(
            /^(\d{2})(\d)/,
            '$1.$2'
        );


    numeros =
        numeros.replace(
            /^(\d{2})\.(\d{3})(\d)/,
            '$1.$2.$3'
        );


    numeros =
        numeros.replace(
            /\.(\d{3})(\d)/,
            '.$1/$2'
        );


    numeros =
        numeros.replace(
            /(\d{4})(\d)/,
            '$1-$2'
        );


    return numeros;

}


// ==================================================
// MÁSCARA DE TELEFONE
// ==================================================

function aplicarMascaraTelefone(
    valor
) {


    const numeros =

        valor
            .replace(
                /\D/g,
                ''
            )
            .slice(
                0,
                11
            );


    // Apenas DDD parcialmente digitado

    if (
        numeros.length <= 2
    ) {

        return numeros;

    }


    // DDD + início do número

    if (
        numeros.length <= 6
    ) {

        return (

            `(${numeros.slice(0, 2)}) ` +

            numeros.slice(2)

        );

    }


    // Telefone fixo

    if (
        numeros.length <= 10
    ) {

        return (

            `(${numeros.slice(0, 2)}) ` +

            `${numeros.slice(2, 6)}-` +

            numeros.slice(6)

        );

    }


    // Celular com 9 dígitos

    return (

        `(${numeros.slice(0, 2)}) ` +

        `${numeros.slice(2, 7)}-` +

        numeros.slice(7)

    );

}


// ==================================================
// APLICAR MÁSCARA AO CNPJ DURANTE A DIGITAÇÃO
// ==================================================

if (cnpj) {


    cnpj.addEventListener(

        'input',

        () => {


            cnpj.value =
                aplicarMascaraCNPJ(
                    cnpj.value
                );

        }

    );

}


// ==================================================
// APLICAR MÁSCARA AO TELEFONE
// ==================================================

if (telefone) {


    telefone.addEventListener(

        'input',

        () => {


            telefone.value =
                aplicarMascaraTelefone(
                    telefone.value
                );

        }

    );

}


// ==================================================
// NAVEGAÇÃO COM ENTER
// ==================================================
//
// Permite cadastrar utilizando o teclado,
// sem obrigar o usuário a clicar no botão.
//
// ==================================================

document.addEventListener(

    'keydown',

    evento => {


        if (
            evento.key !== 'Enter'
        ) {

            return;

        }


        const alvo =
            evento.target;


        // ------------------------------------------
        // FORMULÁRIO DE PRODUTO
        // ------------------------------------------

        if (

            [
                nomeProduto,
                categoria,
                unidade
            ].includes(alvo)

        ) {


            evento.preventDefault();


            btnCadastrarProduto
                ?.click();

        }


        // ------------------------------------------
        // FORMULÁRIO DE FORNECEDOR
        // ------------------------------------------

        if (

            [
                empresa,
                cnpj,
                telefone,
                consultor,
                email,
                dataCadastro
            ].includes(alvo)

        ) {


            evento.preventDefault();


            btnCadastrarFornecedor
                ?.click();

        }

    }

);


// ==================================================
// INICIALIZAÇÃO
// ==================================================


// Preenche automaticamente a data
// atual no cadastro de fornecedor.

if (
    dataCadastro &&
    !dataCadastro.value
) {


    dataCadastro.value =
        obterDataAtual();

}


// Carrega a listagem de produtos.

carregarProdutos();
