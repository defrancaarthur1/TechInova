CREATE DATABASE IF NOT EXISTS adega_controle;

USE adega_controle;


-- ============================================
-- TABELA DE PRODUTOS
-- ============================================

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    unidade VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) DEFAULT 0.00,
    quantidade INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- TABELA DE FORNECEDORES
-- ============================================

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa VARCHAR(100) NOT NULL,
    CNPJ VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    consultor VARCHAR(100),
    email VARCHAR(100),
    data_cadastro DATE
);

-- ============================================
-- TABELA DE COMPRAS
-- ============================================

CREATE TABLE IF NOT EXISTS Compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fornecedor_id INT NOT NULL,
    data_compra DATE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT fk_compras_fornecedor
        FOREIGN KEY (fornecedor_id)
        REFERENCES fornecedores(id)
);

-- ============================================
-- TABELA DE ITENS_COMPRAS
-- ============================================

CREATE TABLE IF NOT EXISTS Itens_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_itens_compra_compra
        FOREIGN KEY (compra_id)
        REFERENCES Compras(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_itens_compra_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);

USE adega_controle;

SELECT * FROM fornecedores;
