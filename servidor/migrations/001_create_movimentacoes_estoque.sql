CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id INT NOT NULL AUTO_INCREMENT,
    compra_id INT NOT NULL,
    produto_id INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_movimentacoes_compra (compra_id),
    KEY idx_movimentacoes_produto (produto_id),
    CONSTRAINT fk_movimentacao_compra
        FOREIGN KEY (compra_id) REFERENCES compras (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_movimentacao_produto
        FOREIGN KEY (produto_id) REFERENCES produtos (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
