# Sistema de Controle de Compras da Adega

Projeto acadêmico desenvolvido para gerenciamento de compras de uma adega.

O sistema tem como objetivo permitir o cadastro e gerenciamento de fornecedores, produtos, categorias e compras, além do registro do histórico de compras e geração de relatórios.

## Tecnologias utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- Node.js
- Express.js

### Banco de Dados
- MySQL
- MySQL Workbench

### Versionamento
- Git
- GitHub

## Arquitetura

O projeto utiliza uma organização baseada no padrão MVC.

- Model: responsável pelo acesso e manipulação dos dados.
- View: responsável pelas interfaces utilizadas pelo usuário.
- Controller: responsável por receber as requisições e controlar as operações do sistema.

A aplicação também utiliza rotas para realizar a comunicação entre o front-end e o back-end.

## Estrutura do Projeto

sistema-adega/

├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── fornecedores.html
│   ├── produtos.html
│   ├── compras.html
│   ├── historico.html
│   ├── relatorios.html
│   ├── css/
│   └── js/
│
├── banco/
│   └── sistema_compras.sql
│
├── testes/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

## Funcionalidades previstas

- Login no sistema
- Cadastro de fornecedores
- Cadastro de produtos
- Cadastro de categorias
- Consulta de registros
- Edição de registros
- Exclusão de registros
- Registro de compras
- Associação de produtos às compras
- Atualização de estoque
- Histórico de compras
- Relatórios

## Configuração do ambiente

Para executar o projeto é necessário possuir:

- Visual Studio Code
- Node.js
- npm
- MySQL Server
- MySQL Workbench
- Git

## Instalação das dependências

Abra o terminal na pasta raiz do projeto e execute:

npm install

## Configuração do banco de dados

Crie o banco de dados utilizando o arquivo:

banco/sistema_compras.sql

Depois configure o arquivo `.env` com os dados da conexão MySQL.

Exemplo:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_compras

## Executando o servidor

Na pasta raiz do projeto, execute:

npm start

O servidor será iniciado utilizando o arquivo:

backend/server.js

## Situação atual do projeto

O projeto encontra-se em desenvolvimento.

Na primeira etapa foram realizadas:

- configuração do ambiente de desenvolvimento;
- criação da estrutura inicial do projeto;
- definição da arquitetura MVC;
- preparação da conexão com o MySQL;
- configuração das dependências Node.js;
- organização do versionamento com Git/GitHub.

## Equipe

Techinova