USE sistema_compras;

CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE Fornecedor (
    CNPJ CHAR(14) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(150),
    dataCadastro DATE,
    consultorVenda VARCHAR(100),
    telefoneConsultor VARCHAR(20)
);

CREATE TABLE Produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    preco DECIMAL(10,2),
    quantidade INT DEFAULT 0,
    dataCadastro DATE
);

CREATE TABLE Compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notaFiscal VARCHAR(50),
    dataCompra DATE,
    valorTotal DECIMAL(10,2),
    categoria VARCHAR(50),
    quantidade INT,
    fornecedor VARCHAR(100)
);

CREATE TABLE ItemCompra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compraId INT,
    produtoId INT,
    quantidade INT,
    valorUnitario DECIMAL(10,2)
);

SHOW TABLES;
SELECT * FROM Produto;
