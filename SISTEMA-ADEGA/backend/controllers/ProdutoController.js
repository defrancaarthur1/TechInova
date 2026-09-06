const ProdutoModel =
    require("../models/ProdutoModel");


const ProdutoController = {


    cadastrar: (req, res) => {

        const produto =
            req.body;


        if (
            !produto.nome ||
            !produto.categoria ||
            produto.quantidade === undefined ||
            produto.preco === undefined
        ) {

            return res
                .status(400)
                .json({

                    mensagem:
                        "Preencha todos os campos obrigatórios."

                });

        }


        if (
            produto.quantidade < 0 ||
            produto.preco < 0
        ) {

            return res
                .status(400)
                .json({

                    mensagem:
                        "Quantidade e preço não podem ser negativos."

                });

        }


        ProdutoModel.cadastrar(
            produto,
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro ao cadastrar produto:",
                        erro
                    );


                    return res
                        .status(500)
                        .json({

                            mensagem:
                                "Erro ao cadastrar produto."

                        });

                }


                res
                    .status(201)
                    .json({

                        mensagem:
                            "Produto cadastrado com sucesso!",

                        id:
                            resultado.insertId

                    });

            }
        );

    },


    listar: (req, res) => {

        ProdutoModel.listar(
            (erro, produtos) => {

                if (erro) {

                    console.error(
                        "Erro ao listar produtos:",
                        erro
                    );


                    return res
                        .status(500)
                        .json({

                            mensagem:
                                "Erro ao consultar produtos."

                        });

                }


                res.json(produtos);

            }
        );

    }

};


module.exports =
    ProdutoController;
