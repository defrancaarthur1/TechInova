const conexao =
    require("../config/database");


const ProdutoModel = {


    cadastrar: (
        produto,
        callback
    ) => {

        const sql = `
            INSERT INTO Produto
            (
                nome,
                categoria,
                preco,
                quantidade
            )
            VALUES (?, ?, ?, ?)
        `;


        const valores = [

            produto.nome,

            produto.categoria,

            produto.preco,

            produto.quantidade

        ];


        conexao.query(
            sql,
            valores,
            callback
        );

    },


    listar: (callback) => {

        const sql = `
            SELECT *
            FROM Produto
            ORDER BY nome
        `;


        conexao.query(
            sql,
            callback
        );

    }

};


module.exports =
    ProdutoModel;
