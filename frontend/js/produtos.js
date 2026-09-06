document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ===================================== */
        /* TELA PRODUTOS.HTML */
        /* ===================================== */

        const formProduto =
            document.getElementById(
                "formProduto"
            );


        if (formProduto) {

            formProduto.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const nome =
                        document
                            .getElementById(
                                "nomeProduto"
                            )
                            .value
                            .trim();


                    const categoria =
                        document
                            .getElementById(
                                "categoria"
                            )
                            .value;


                    const quantidade =
                        Number(
                            document
                                .getElementById(
                                    "quantidade"
                                )
                                .value
                        );


                    const preco =
                        Number(
                            document
                                .getElementById(
                                    "valorUnitario"
                                )
                                .value
                        );


                    const produto = {

                        nome: nome,

                        categoria: categoria,

                        quantidade: quantidade,

                        preco: preco

                    };


                    await cadastrarProduto(
                        produto,
                        formProduto
                    );

                }
            );

        }



        /* ===================================== */
        /* CADASTRO RÁPIDO DA PÁGINA INICIAL */
        /* ===================================== */

        const formProdutoInicio =
            document.getElementById(
                "formProdutoInicio"
            );


        if (formProdutoInicio) {

            formProdutoInicio.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const nome =
                        document
                            .getElementById(
                                "nomeProdutoInicio"
                            )
                            .value
                            .trim();


                    const categoria =
                        document
                            .getElementById(
                                "categoriaProdutoInicio"
                            )
                            .value;


                    const quantidade =
                        Number(
                            document
                                .getElementById(
                                    "quantidadeProdutoInicio"
                                )
                                .value
                        );


                    const preco =
                        Number(
                            document
                                .getElementById(
                                    "valorProdutoInicio"
                                )
                                .value
                        );


                    const produto = {

                        nome: nome,

                        categoria: categoria,

                        quantidade: quantidade,

                        preco: preco

                    };


                    await cadastrarProduto(
                        produto,
                        formProdutoInicio
                    );

                }
            );

        }



        /* ===================================== */
        /* FUNÇÃO DE CADASTRO */
        /* ===================================== */

        async function cadastrarProduto(
            produto,
            formulario
        ) {


            /* VALIDAÇÃO */

            if (
                !produto.nome ||
                !produto.categoria
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;
            }


            if (
                produto.quantidade < 0
            ) {

                alert(
                    "A quantidade não pode ser negativa."
                );

                return;
            }


            if (
                produto.preco < 0
            ) {

                alert(
                    "O valor não pode ser negativo."
                );

                return;
            }



            /* ENVIO PARA O BACKEND */

            try {

                const resposta =
                    await fetch(
                        "/produtos",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    produto
                                )

                        }
                    );


                const dados =
                    await resposta.json();



                /* ERRO */

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Erro ao cadastrar produto."
                    );

                    return;
                }



                /* SUCESSO */

                alert(
                    dados.mensagem
                );


                formulario.reset();



                /*
                    Se estivermos na página inicial,
                    atualiza automaticamente
                    o select de produtos.
                */

                carregarProdutos();


            } catch (erro) {

                console.error(
                    "Erro ao cadastrar produto:",
                    erro
                );


                alert(
                    "Não foi possível conectar com o servidor."
                );

            }

        }



        /* ===================================== */
        /* BUSCAR PRODUTOS DO MYSQL */
        /* ===================================== */

        async function carregarProdutos() {


            const selectProdutoCompra =
                document.getElementById(
                    "produtoCompra"
                );


            /*
                Se não estivermos na página inicial,
                esse select não existirá.
            */

            if (!selectProdutoCompra) {

                return;

            }


            try {

                const resposta =
                    await fetch(
                        "/produtos"
                    );


                if (!resposta.ok) {

                    console.error(
                        "Erro ao consultar produtos."
                    );

                    return;

                }


                const produtos =
                    await resposta.json();



                /* LIMPA SELECT */

                selectProdutoCompra.innerHTML = "";


                /* OPÇÃO PADRÃO */

                const opcaoPadrao =
                    document.createElement(
                        "option"
                    );


                opcaoPadrao.value = "";

                opcaoPadrao.textContent =
                    "Selecione";


                selectProdutoCompra.appendChild(
                    opcaoPadrao
                );



                /* PRODUTOS DO BANCO */

                produtos.forEach(
                    (produto) => {


                        const opcao =
                            document.createElement(
                                "option"
                            );


                        opcao.value =
                            produto.id;


                        opcao.textContent =
                            produto.nome;


                        selectProdutoCompra.appendChild(
                            opcao
                        );

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro ao carregar produtos:",
                    erro
                );

            }

        }



        /* ===================================== */
        /* CARREGA PRODUTOS AO ABRIR A HOME */
        /* ===================================== */

        carregarProdutos();


    }
);