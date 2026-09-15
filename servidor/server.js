const express = require('express');

const cors = require('cors');

const session = require('express-session');

const path = require('path');

const banco = require('./banco');


const fornecedorRoutes =
    require('./routes/fornecedorRoutes');

const produtoRoutes =
    require('./routes/produtoRoutes');

const usuarioRoutes =
    require('./routes/usuarioRoutes');


const app = express();


// ========================================
// CORS
// ========================================

app.use(cors({

    origin: true,

    credentials: true

}));


// ========================================
// JSON
// ========================================

app.use(express.json());


app.use(express.urlencoded({

    extended: true

}));


// ========================================
// SESSÃO
// ========================================

app.use(session({

    secret:
        'controle-fornecedores-adega',

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        maxAge:
            1000 * 60 * 60 * 8

    }

}));


// ========================================
// FRONT-END
// ========================================

app.use(

    express.static(

        path.join(
            __dirname,
            '..'
        )

    )

);


// ========================================
// ROTAS
// ========================================

app.use(

    '/api/fornecedores',

    fornecedorRoutes

);


app.use(

    '/api/produtos',

    produtoRoutes

);


app.use(

    '/api/usuarios',

    usuarioRoutes

);


// ========================================
// TESTAR BANCO
// ========================================

app.get(
    '/api/teste-banco',

    async (req, res) => {

        try {

            const [resultado] =
                await banco.query(
                    'SELECT 1 AS conectado'
                );


            res.json({

                sucesso: true,

                mensagem:
                    'Servidor conectado ao MySQL.',

                resultado

            });


        } catch (erro) {

            console.error(erro);


            res.status(500).json({

                sucesso: false,

                mensagem:
                    'Erro ao conectar ao MySQL.',

                erro:
                    erro.message

            });

        }

    }
);


// ========================================
// SERVIDOR
// ========================================

const PORT = 3000;


app.listen(PORT, () => {

    console.log(

        `Servidor iniciado em http://localhost:${PORT}`

    );

});
