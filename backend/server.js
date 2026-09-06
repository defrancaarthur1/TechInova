const express =
    require("express");


const path =
    require("path");


const produtoRoutes =
    require(
        "./routes/produtoRoutes"
    );


const app =
    express();


const PORT =
    3000;


/* Permite receber JSON */

app.use(
    express.json()
);


/* Disponibiliza o frontend */

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


/* Página inicial */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/views/index.html"
            )
        );

    }
);


/* API de produtos */

app.use(
    "/produtos",
    produtoRoutes
);


/* Inicia servidor */

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor executando em http://localhost:${PORT}`
        );

    }
);