const express = require('express');

const cors = require('cors');

const session = require('express-session');

const path = require('path');

const banco = require('./banco');
const aplicarMigracoes = require('./aplicarMigracoes');


const fornecedorRoutes =
    require('./routes/fornecedorRoutes');

const produtoRoutes =
    require('./routes/produtoRoutes');

const usuarioRoutes =
    require('./routes/usuarioRoutes');

    const compraRoutes = require('./routes/compraRoutes');


const app = express();
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);


// Requisições do frontend usam a mesma origem; CORS aberto não é necessário.
// ========================================
// JSON
// ========================================

app.use(express.json());


app.use(express.urlencoded({

    extended: true

}));

// Impede alterações enviadas por páginas de outra origem.
app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const origem = req.get('origin');
        const host = req.get('host');
        if (origem) {
            try { if (new URL(origem).host !== host) return res.status(403).json({ mensagem: 'Origem não permitida.' }); }
            catch { return res.status(403).json({ mensagem: 'Origem inválida.' }); }
        }
    }
    next();
});



// ========================================
// SESSÃO
// ========================================

app.use(session({

    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV !== 'production' ? 'somente-desenvolvimento-altere-esta-chave' : (() => { throw new Error('Defina SESSION_SECRET no Render.'); })()),

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',

        maxAge:
            1000 * 60 * 60 * 8

    }

}));


// Servir apenas arquivos públicos da raiz (não expor servidor/, .env, SQL ou anexos).
const raiz = path.resolve(__dirname, '..');
const paginas = new Set(['login.html', 'index.html', 'cadastros.html', 'editar-excluir.html', 'historico.html', 'configuracoes.html']);
const scripts = new Set(['login.js', 'auth.js', 'cadastro.js', 'historico.js', 'editar-excluir.js', 'script.js', 'configuracoes.js', 'adegastyle.css']);
app.get('/', (req, res) => res.redirect('/login.html'));
app.get('/:arquivo', (req, res, next) => {
    const arquivo = req.params.arquivo;
    if (!paginas.has(arquivo) && !scripts.has(arquivo)) return next();
    res.sendFile(path.join(raiz, arquivo));
});

// Autenticação obrigatória nas APIs de negócio, inclusive para chamadas diretas.
async function protegerApi(req, res, next) {
    if (!req.session?.usuario?.id || !req.session.credencial) return res.status(401).json({ mensagem: 'Faça login novamente.' });
    try {
        const [linhas] = await banco.execute('SELECT senha, email FROM usuarios WHERE id = ? AND ativo = TRUE', [req.session.usuario.id]);
        if (!linhas.length || linhas[0].senha !== req.session.credencial || linhas[0].email !== req.session.usuario.email) {
            return req.session.destroy(() => res.status(401).json({ mensagem: 'Sessão expirada. Faça login novamente.' }));
        }
        next();
    } catch (erro) {
        console.error('Erro na autenticação:', erro);
        res.status(500).json({ mensagem: 'Erro ao verificar autenticação.' });
    }
}
app.use('/api/fornecedores', protegerApi);
app.use('/api/produtos', protegerApi);
app.use('/api/compras', protegerApi);
app.use('/api/usuarios', protegerApi);
app.use('/api/sessao', protegerApi);

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

app.use('/api/compras', compraRoutes);

// ROTAS DE LOGIN, LOGOUT E SESSÃO

app.use(

    '/api',

    usuarioRoutes

);


// ========================================
// SERVIDOR
// ========================================

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
    await aplicarMigracoes(banco);

    app.listen(PORT, () => {
        console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });
}

iniciarServidor().catch(erro => {
    console.error('Erro ao preparar o banco de dados:', erro);
    process.exit(1);
});
