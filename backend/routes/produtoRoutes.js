const express =
    require("express");


const router =
    express.Router();


const ProdutoController =
    require(
        "../controllers/ProdutoController"
    );


router.post(
    "/",
    ProdutoController.cadastrar
);


router.get(
    "/",
    ProdutoController.listar
);


module.exports =
    router;