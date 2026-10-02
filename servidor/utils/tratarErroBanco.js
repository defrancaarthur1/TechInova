// =====================================================
// TRATAMENTO CENTRALIZADO DE ERROS DO MYSQL
// =====================================================

function tratarErroBanco(
    erro,
    res,
    mensagemPadrao = 'Erro durante a operação com o banco de dados.'
) {

    // O erro completo fica somente no terminal.
    // Isso ajuda na manutenção sem expor informações
    // técnicas para o usuário.
    console.error('========================================');
    console.error('ERRO DE PERSISTÊNCIA');
    console.error('Código:', erro.code);
    console.error('Mensagem:', erro.message);
    console.error('========================================');


    // =================================================
    // REGISTRO DUPLICADO
    // =================================================

    if (erro.code === 'ER_DUP_ENTRY') {

        return res.status(409).json({
            sucesso: false,
            mensagem: 'Já existe um registro com estes dados.'
        });

    }


    // =================================================
    // FALHA DE AUTENTICAÇÃO DO MYSQL
    // =================================================

    if (erro.code === 'ER_ACCESS_DENIED_ERROR') {

        return res.status(500).json({
            sucesso: false,
            mensagem:
                'Não foi possível autenticar no banco de dados.'
        });

    }


    // =================================================
    // BANCO NÃO EXISTE
    // =================================================

    if (erro.code === 'ER_BAD_DB_ERROR') {

        return res.status(500).json({
            sucesso: false,
            mensagem:
                'O banco de dados configurado não foi encontrado.'
        });

    }


    // =================================================
    // TABELA NÃO EXISTE
    // =================================================

    if (
        erro.code === 'ER_NO_SUCH_TABLE' ||
        erro.code === 'ER_BAD_TABLE_ERROR'
    ) {

        return res.status(500).json({
            sucesso: false,
            mensagem:
                'Erro na estrutura do banco de dados.'
        });

    }


    // =================================================
    // COLUNA NÃO EXISTE
    // =================================================

    if (erro.code === 'ER_BAD_FIELD_ERROR') {

        return res.status(500).json({
            sucesso: false,
            mensagem:
                'Erro na estrutura dos dados do sistema.'
        });

    }


    // =================================================
    // CHAVE ESTRANGEIRA INVÁLIDA
    // =================================================

    if (
        erro.code ===
        'ER_NO_REFERENCED_ROW_2'
    ) {

        return res.status(400).json({
            sucesso: false,
            mensagem:
                'O registro relacionado não existe.'
        });

    }


    // =================================================
    // TENTATIVA DE EXCLUIR REGISTRO EM USO
    // =================================================

    if (
        erro.code ===
        'ER_ROW_IS_REFERENCED_2'
    ) {

        return res.status(409).json({
            sucesso: false,
            mensagem:
                'Este registro não pode ser excluído porque está sendo utilizado por outro registro.'
        });

    }


    // =================================================
    // CONEXÃO RECUSADA
    // =================================================

    if (erro.code === 'ECONNREFUSED') {

        return res.status(503).json({
            sucesso: false,
            mensagem:
                'Não foi possível conectar ao banco de dados.'
        });

    }


    // =================================================
    // CONEXÃO PERDIDA
    // =================================================

    if (
        erro.code === 'PROTOCOL_CONNECTION_LOST' ||
        erro.code === 'ECONNRESET'
    ) {

        return res.status(503).json({
            sucesso: false,
            mensagem:
                'A conexão com o banco de dados foi perdida.'
        });

    }


    // =================================================
    // TIMEOUT
    // =================================================

    if (
        erro.code === 'ETIMEDOUT' ||
        erro.code === 'PROTOCOL_SEQUENCE_TIMEOUT'
    ) {

        return res.status(504).json({
            sucesso: false,
            mensagem:
                'O banco de dados demorou muito para responder.'
        });

    }


    // =================================================
    // VALOR NULO EM CAMPO OBRIGATÓRIO
    // =================================================

    if (erro.code === 'ER_BAD_NULL_ERROR') {

        return res.status(400).json({
            sucesso: false,
            mensagem:
                'Um campo obrigatório não foi informado.'
        });

    }


    // =================================================
    // DADO MUITO GRANDE PARA A COLUNA
    // =================================================

    if (erro.code === 'ER_DATA_TOO_LONG') {

        return res.status(400).json({
            sucesso: false,
            mensagem:
                'Um dos dados informados ultrapassa o tamanho permitido.'
        });

    }


    // =================================================
    // ERRO NÃO PREVISTO
    // =================================================

    return res.status(500).json({
        sucesso: false,
        mensagem: mensagemPadrao
    });

}


module.exports = tratarErroBanco;