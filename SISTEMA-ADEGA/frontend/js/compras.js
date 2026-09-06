document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ===================================== */
        /* CARREGAR PRODUTOS */
        /* ===================================== */

        async function carregarProdutos() {

            const selectProduto =
                document.getElementById("produto");


            if (!selectProduto) {
                return;
            }


            try {

                const resposta =
                    await fetch("/produtos");


                if (!resposta.ok) {

                    console.error(
                        "Erro ao consultar produtos."
                    );

                    return;
                }


                const produtos =
                    await resposta.json();


                /* LIMPA O SELECT */

                selectProduto.innerHTML = "";


                /* OPÇÃO PADRÃO */

                const opcaoPadrao =
                    document.createElement("option");


                opcaoPadrao.value = "";

                opcaoPadrao.textContent =
                    "Selecione";


                selectProduto.appendChild(
                    opcaoPadrao
                );


                /* ADICIONA OS PRODUTOS DO MYSQL */

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


                        selectProduto.appendChild(
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
        /* FORMULÁRIO DE COMPRA */
        /* ===================================== */

        const formCompra =
            document.getElementById(
                "formCompra"
            );


        if (formCompra) {

            formCompra.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();


                    /*
                        O registro da compra no banco
                        será implementado depois.
                    */

                    alert(
                        "Formulário de compra funcionando."
                    );

                }
            );

        }


        /* ===================================== */
        /* EXECUTA AO ABRIR A PÁGINA */
        /* ===================================== */

        carregarProdutos();

    }
);
