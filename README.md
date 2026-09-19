# TechInova - Sistema de Controle de Compras

Sistema web desenvolvido como projeto acadêmico da FATEC para auxiliar no controle de compras de uma adega.

O sistema permite realizar o cadastro e gerenciamento de produtos e fornecedores, além do registro e consulta das compras realizadas.

---

## Funcionalidades

O sistema possui as seguintes funcionalidades:

### Produtos

- Cadastro de produtos;
- Consulta de produtos cadastrados;
- Edição de produtos;
- Exclusão de produtos.

### Fornecedores

- Cadastro de fornecedores;
- Consulta de fornecedores cadastrados;
- Edição de fornecedores;
- Exclusão de fornecedores.

### Compras

- Seleção de fornecedores cadastrados;
- Seleção de produtos cadastrados;
- Adição de produtos à compra;
- Registro da quantidade;
- Registro do valor unitário;
- Registro da data da compra;
- Visualização dos itens adicionados;
- Consulta do histórico de compras.

As listas de produtos e fornecedores utilizadas na tela de registro são carregadas a partir dos dados cadastrados no sistema.

---

## Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

### Front-end

- HTML5;
- CSS3;
- JavaScript.

### Back-end

- Node.js;
- Express.

### Banco de dados

- MySQL;
- mysql2.

### Desenvolvimento e versionamento

- Visual Studio Code;
- Git;
- GitHub.

---

## Estrutura principal do projeto

A estrutura principal do projeto é semelhante a:

```text
TechInova-main/
│
├── index.html
├── cadastros.html
├── cadastro.js
├── historico.html
├── historico.js
├── login.html
├── login.js
├── adegastyle.css
│
├── adega_controle.sql
│
├── package.json
├── package-lock.json
├── README.md
│
└── servidor/
    ├── server.js
    ├── banco.js
    │
    └── routes/
        ├── produtoRoutes.js
        └── fornecedorRoutes.js
```

---

# Como instalar e executar o sistema

Para executar o sistema em outro computador, siga as etapas abaixo.

---

## 1. Programas necessários

Antes de executar o projeto, certifique-se de que o computador possui:

- Node.js;
- MySQL Server;
- Visual Studio Code.

O Git também pode ser utilizado caso o projeto seja clonado diretamente do GitHub.

---

## 2. Baixar o projeto

O projeto pode ser baixado diretamente pelo GitHub.

Também é possível utilizar o Git para clonar o repositório.

Após baixar ou clonar o projeto, abra a pasta do sistema no Visual Studio Code.

Exemplo:

```text
TechInova-main
```

No Visual Studio Code, utilize:

```text
File > Open Folder
```

e selecione a pasta do projeto.

---

## 3. Instalar as dependências

Com o projeto aberto no Visual Studio Code, abra o terminal:

```text
Terminal > New Terminal
```

Certifique-se de que o terminal está localizado na pasta principal do projeto.

Execute:

```bash
npm install
```

O comando instalará automaticamente as dependências configuradas no arquivo `package.json`.

---

# Configuração do banco de dados

O sistema utiliza o MySQL para armazenar os dados.

O banco utilizado pelo projeto é:

```text
adega_controle
```

O projeto possui o arquivo:

```text
adega_controle.sql
```

Esse arquivo deve ser utilizado para preparar o banco de dados em um computador novo.

---

## 4. Iniciar o MySQL

Antes de iniciar o sistema, certifique-se de que o serviço do MySQL Server está em execução.

Você pode utilizar o MySQL Workbench ou outro cliente compatível com MySQL para executar o script SQL.

---

## 5. Criar o banco de dados

Abra o arquivo:

```text
adega_controle.sql
```

no MySQL Workbench.

Execute todo o conteúdo do arquivo.

O script será responsável pela criação do banco:

```sql
adega_controle
```

e das tabelas necessárias para o funcionamento do sistema.

O comando utiliza:

```sql
CREATE DATABASE IF NOT EXISTS adega_controle;
```

Portanto, o banco será criado caso ainda não exista.

---

## 6. Configurar a conexão com o MySQL

Depois de criar o banco, abra no Visual Studio Code o arquivo:

```text
servidor/banco.js
```

Verifique as configurações de conexão com o MySQL.

A configuração segue uma estrutura semelhante a:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'SUA_SENHA_MYSQL',
    database: 'adega_controle'
});

module.exports = pool;
```

### Atenção

O usuário e a senha do MySQL podem ser diferentes em cada computador.

Por isso, verifique principalmente:

```javascript
user: 'root',
password: 'SUA_SENHA_MYSQL'
```

Caso o usuário `root` não possua senha, a configuração poderá utilizar:

```javascript
password: ''
```

Não altere o nome do banco caso esteja utilizando o banco padrão do projeto:

```javascript
database: 'adega_controle'
```

---

# Iniciando o sistema

## 7. Iniciar o servidor

Depois que:

- as dependências estiverem instaladas;
- o MySQL estiver em execução;
- o banco `adega_controle` estiver criado;
- a conexão com o banco estiver configurada;

volte ao terminal do Visual Studio Code.

Execute:

```bash
node servidor/server.js
```

O servidor Node.js será iniciado.

Caso tudo esteja configurado corretamente, o terminal deverá informar que o servidor está em execução.

---

## 8. Abrir o sistema

Com o servidor funcionando, abra um navegador.

Acesse:

```text
http://localhost:3000
```

Caso necessário, também é possível acessar diretamente:

```text
http://localhost:3000/index.html
```

A página inicial do Sistema de Controle de Compras será exibida.

---

# Páginas do sistema

## Registrar Compra

Página principal do sistema.

Permite selecionar um fornecedor e produtos cadastrados e informar os dados necessários para uma compra.

A página utiliza os fornecedores e produtos cadastrados no banco de dados.

---

## Cadastros

Página destinada ao gerenciamento dos cadastros.

Permite realizar operações de:

- cadastro;
- consulta;
- edição;
- exclusão.

Atualmente são gerenciados:

- produtos;
- fornecedores.

---

## Histórico

Página destinada à consulta das compras registradas no sistema.

---

# Banco de dados

O sistema utiliza o banco:

```text
adega_controle
```

Os dados cadastrados devem ser armazenados no MySQL para permanecerem disponíveis mesmo depois que o servidor for encerrado.

Isso significa que fechar o Visual Studio Code ou interromper o servidor Node.js não deve apagar produtos ou fornecedores que tenham sido corretamente armazenados no banco.

---

# Abrindo o sistema novamente

Depois da configuração inicial, não é necessário recriar o banco toda vez que o sistema for utilizado.

Nas próximas utilizações, basta:

1. Iniciar o MySQL Server;
2. Abrir a pasta do projeto no Visual Studio Code;
3. Abrir o terminal;
4. Executar:

```bash
node servidor/server.js
```

5. Abrir no navegador:

```text
http://localhost:3000
```

Os dados anteriormente cadastrados no MySQL deverão continuar disponíveis.

---

# Configuração em outro computador

Ao utilizar o sistema pela primeira vez em outro computador:

1. Instale o Node.js;
2. Instale o MySQL Server;
3. Abra o projeto no Visual Studio Code;
4. Execute `npm install`;
5. Execute o arquivo `adega_controle.sql` no MySQL;
6. Configure usuário e senha do MySQL em `servidor/banco.js`;
7. Execute `node servidor/server.js`;
8. Acesse `http://localhost:3000`.

Depois dessa configuração inicial, não será necessário executar novamente o arquivo SQL a cada inicialização.

---

# Solução de problemas

## Erro ao conectar ao MySQL

Caso apareça uma mensagem semelhante a:

```text
Access denied for user 'root'@'localhost'
```

verifique o arquivo:

```text
servidor/banco.js
```

Confira se o usuário e a senha correspondem às credenciais configuradas durante a instalação do MySQL.

---

## Banco de dados não encontrado

Caso apareça um erro informando que o banco:

```text
adega_controle
```

não existe, execute o arquivo:

```text
adega_controle.sql
```

no MySQL.

---

## Tabela não encontrada

Caso o sistema informe que uma tabela não existe, execute novamente o script:

```text
adega_controle.sql
```

e verifique se todas as tabelas necessárias estão presentes no arquivo.

---

## Produtos ou fornecedores não aparecem

Primeiro, verifique se o MySQL Server está funcionando.

Depois, confirme se os registros existem no banco de dados.

Para produtos:

```sql
USE adega_controle;

SELECT * FROM produtos;
```

Para fornecedores:

```sql
USE adega_controle;

SELECT * FROM fornecedores;
```

---

## Servidor não inicia

Certifique-se de ter executado:

```bash
npm install
```

antes de iniciar o projeto.

Depois tente novamente:

```bash
node servidor/server.js
```

---

## Porta 3000

Por padrão, o sistema é acessado através da porta:

```text
3000
```

Portanto, o endereço utilizado é:

```text
http://localhost:3000
```

---

# Observações importantes

- O MySQL Server precisa estar funcionando para que o sistema acesse os dados;
- Os produtos e fornecedores devem ser armazenados no banco `adega_controle`;
- O arquivo `adega_controle.sql` é utilizado na configuração inicial do banco;
- Não é necessário executar o SQL toda vez que o sistema for iniciado;
- O comando `npm install` normalmente só precisa ser executado na primeira configuração ou quando houver alteração nas dependências;
- Para iniciar normalmente o sistema, utilize `node servidor/server.js`.

---

# Projeto acadêmico

Projeto desenvolvido para a FATEC como parte das atividades acadêmicas do curso de Gestão da Tecnologia da Informação.

O sistema tem como objetivo aplicar conceitos de desenvolvimento web, banco de dados, arquitetura de aplicações, integração entre front-end e back-end e controle de versões utilizando Git/GitHub.


 LINK MONOGRAFIA { https://teams.microsoft.com/l/message/48:notes/1788887725380?context=%7B%22contextType%22%3A%22chat%22%2C%22oid%22%3A%228%3Aorgid%3Aaa136923-954c-4ffc-a4eb-5d1a8619c1df%22%7D ]
 
