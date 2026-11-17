const fs = require('fs');
const path = require('path');

async function aplicarMigracoes(banco) {
    const [colunasCompra] = await banco.query(
        `SELECT COLUMN_NAME
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'compras'
           AND COLUMN_NAME = 'estoque_contabilizado'`
    );

    if (colunasCompra.length === 0) {
        await banco.query(
            `ALTER TABLE compras
             ADD COLUMN estoque_contabilizado TINYINT(1) NOT NULL DEFAULT 0`
        );
    }

    const caminhoMigracao = path.join(
        __dirname,
        'migrations',
        '001_create_movimentacoes_estoque.sql'
    );
    const sqlMigracao = fs.readFileSync(caminhoMigracao, 'utf8');
    await banco.query(sqlMigracao);
}

module.exports = aplicarMigracoes;
