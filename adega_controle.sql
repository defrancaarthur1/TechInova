CREATE DATABASE IF NOT EXISTS adega_controle;
   
USE adega_controle;


CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    unidade VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) DEFAULT 0.00,
    quantidade INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa VARCHAR(100) NOT NULL,
    CNPJ VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    consultor VARCHAR(100),
    email VARCHAR(100),
    data_cadastro DATE
    
    );
    
    CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_cadastro TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, ativo)
SELECT 'Administrador', 'admin@adega.com', '$2b$10$vudXvMHXn70HQ4r6szhtt.1jgXVIFnDHd0/tRRkGJh/DXMRedCkOS', 1
WHERE NOT EXISTS (
SELECT 1 FROM usuarios WHERE email = 'admin@adega.com'

);

USE adega_controle;

SELECT * FROM fornecedores;

UPDATE usuarios
SET senha = '$2b$10$vudXvMHXn70HQ4r6szhtt.1jgXVIFnDHd0/tRRkGJh/DXMRedCkOS'
WHERE email = 'admin@adega.com'
    AND senha NOT LIKE '$2%';


