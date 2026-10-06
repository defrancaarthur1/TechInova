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

USE adega_controle;

SELECT * FROM fornecedores;
SELECT * FROM produtos;

Show tables ;

USE adega_controle;
USE adega_controle;

ALTER TABLE itens_compra
ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00;

INSERT INTO usuarios (nome, email, senha)
VALUES ('Administrador', 'admin@adega.com', 'TEMPORARIA');

SELECT id, nome, email, senha
FROM usuarios;

SELECT 
    nome,
    categoria,
    unidade,
    COUNT(*) AS quantidade
FROM produtos
GROUP BY nome, categoria, unidade
HAVING COUNT(*) > 1;

ALTER TABLE produtos
ADD CONSTRAINT uq_produto_nome_categoria_unidade
UNIQUE (nome, categoria, unidade);

DESCRIBE produtos;
SELECT *
FROM produtos
ORDER BY id DESC;

SELECT * FROM compras;
SELECT * FROM itens_compra;

SELECT * FROM compras ORDER BY id DESC;

SELECT * FROM itens_compra ORDER BY id DESC;
