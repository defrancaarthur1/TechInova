console.log('EDITAR-EXCLUIR.JS CARREGADO');

// FORNECEDORES
const selectFornecedorEditar = document.querySelector('#fornecedorEditar');
const selectFornecedorExcluir = document.querySelector('#fornecedorExcluir');
const btnEditarFornecedor = document.querySelector('#btnEditarFornecedor');
const btnExcluirFornecedor = document.querySelector('#btnExcluirFornecedor');

// CARREGAR FORNECEDORES
async function carregarFornecedores() {
    try {
        const resposta = await fetch('/api/fornecedores');
        const dados = await resposta.json();
        const fornecedores = dados.fornecedores || [];

        // SELECT PARA EDITAR
        selectFornecedorEditar.innerHTML = `
            <option value="">
                Selecione o fornecedor
            </option>
        `;

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.empresa;
            selectFornecedorEditar.appendChild(option);
        });

        // SELECT PARA EXCLUIR
        selectFornecedorExcluir.innerHTML = `
            <option value="">
                Selecione o fornecedor
            </option>
        `;

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');

            option.value = fornecedor.id;
            option.textContent = fornecedor.empresa;
            selectFornecedorExcluir.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar fornecedores:', erro);
        alert('Não foi possível carregar os fornecedores.');
    }
}

// PREENCHER FORNECEDOR
selectFornecedorEditar.addEventListener('change', async () => {
        const id = selectFornecedorEditar.value;

        if (!id) {
            return;
        }

        try {
            const resposta = await fetch('/api/fornecedores');
            const dados = await resposta.json();
            const fornecedores = dados.fornecedores || [];

            const fornecedor = fornecedores.find(item => item.id == id);

            if (!fornecedor) {
                return;
            }

            document.querySelector('#empresa').value = fornecedor.empresa || '';
            document.querySelector('#cnpj').value = fornecedor.cnpj || '';
            document.querySelector('#telefone').value = fornecedor.telefone || '';
            document.querySelector('#consultor').value = fornecedor.consultor || '';
            document.querySelector('#email').value = fornecedor.email || '';

            if (fornecedor.data_cadastro) {
                const data = new Date(fornecedor.data_cadastro);
                const ano = data.getFullYear();
                const mes = String(data.getMonth() + 1).padStart(2, '0');
                const dia = String(data.getDate()).padStart(2, '0');
                document.querySelector('#dataCadastro').value =`${ano}-${mes}-${dia}`;

            } else {
                document.querySelector('#dataCadastro').value = '';
            }

        } catch (erro) {
            console.error('Erro ao carregar dados do fornecedor:', erro);
        }
    }
);

// EDITAR FORNECEDOR
btnEditarFornecedor.addEventListener('click', async () => {
        const id = selectFornecedorEditar.value;

        if (!id) {
            alert('Selecione um fornecedor para editar.');
            return;
        }

        const empresa = document.querySelector('#empresa').value.trim();
        const cnpj = document.querySelector('#cnpj').value.trim();
        const telefone = document.querySelector('#telefone').value.trim();
        const consultor = document.querySelector('#consultor').value.trim();
        const email = document.querySelector('#email').value.trim();

        if (!empresa || !cnpj) {
            alert('Preencha a empresa e o CNPJ.');
            return;
        }

        try {
            const resposta = await fetch(`/api/fornecedores/${id}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ empresa, cnpj, telefone, consultor, email})
                    }
                );

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem ||'Erro ao editar fornecedor.');
                return;
            }

            alert(dados.mensagem || 'Fornecedor atualizado com sucesso.');

            carregarFornecedores();

        } catch (erro) {
            console.error('Erro ao editar fornecedor:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    }
);

// EXCLUIR FORNECEDOR
btnExcluirFornecedor.addEventListener('click', async () => {
        const id = selectFornecedorExcluir.value;

        if (!id) {
            alert('Selecione um fornecedor para excluir.');
            return;
        }

        const confirmar = confirm('Tem certeza que deseja excluir este fornecedor?');

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`/api/fornecedores/${id}`, {method: 'DELETE'});

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem || 'Erro ao excluir fornecedor.');
                return;
            }

            alert(dados.mensagem || 'Fornecedor excluído com sucesso.');

            carregarFornecedores();

        } catch (erro) {
            console.error( 'Erro ao excluir fornecedor:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    }
);

// PRODUTOS
const selectProdutoEditar = document.querySelector('#produtoEditar');
const selectProdutoExcluir = document.querySelector('#produtoExcluir');
const btnEditarProduto = document.querySelector('#btnEditarProduto');
const btnExcluirProduto = document.querySelector('#btnExcluirProduto');

// CARREGAR PRODUTOS
async function carregarProdutos() {
    try {
       const resposta = await fetch('/api/produtos');
const dados = await resposta.json();
const produtos = dados.produtos || [];

        // SELECT PARA EDITAR
        selectProdutoEditar.innerHTML = `
            <option value="">
                Selecione o produto
            </option>
        `;

        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id;
            option.textContent = produto.nome;
            selectProdutoEditar.appendChild(option);
        });

        // SELECT PARA EXCLUIR
        selectProdutoExcluir.innerHTML = `
            <option value="">
                Selecione o produto
            </option>
        `;

        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id;
            option.textContent = produto.nome;
            selectProdutoExcluir.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        alert('Não foi possível carregar os produtos.');
    }
}

// PREENCHER PRODUTO
selectProdutoEditar.addEventListener('change', async () => {
        const id = selectProdutoEditar.value;

        if (!id) {
            return;
        }

        try {
            const resposta = await fetch('/api/produtos');
const dados = await resposta.json();
const produtos = dados.produtos || [];
const produto = produtos.find(item => item.id == id);

            if (!produto) {
                return;
            }

            document.querySelector('#nomeProduto').value = produto.nome || '';
            document.querySelector('#categoria').value = produto.categoria_id || '';
            document.querySelector('#unidade').value = produto.unidade || '';

        } catch (erro) {
            console.error('Erro ao carregar dados do produto:', erro);
        }
    }
);

// EDITAR PRODUTO
btnEditarProduto.addEventListener('click', async () => {
        const id = selectProdutoEditar.value;

        if (!id) {
            alert('Selecione um produto para editar.');
            return;
        }

        const nome = document.querySelector('#nomeProduto').value.trim();
        const categoria_id = document.querySelector('#categoria').value;
        const unidade = document.querySelector('#unidade').value;

        console.log('DADOS PARA EDITAR:', {
    nome,
    categoria_id,
    unidade
});

        if (!nome || !categoria_id || !unidade) {
            alert('Preencha o nome, a categoria e a unidade do produto.');
            return;
        }

        try {
            const resposta = await fetch(`/api/produtos/${id}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({nome, categoria_id, unidade})
                    }
                );

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem || 'Erro ao editar produto.');
                return;
            }

            alert(dados.mensagem || 'Produto atualizado com sucesso.');

            carregarProdutos();

        } catch (erro) {
            console.error('Erro ao editar produto:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    }
);

// EXCLUIR PRODUTO
btnExcluirProduto.addEventListener('click', async () => {
        const id = selectProdutoExcluir.value;

        if (!id) {
            alert('Selecione um produto para excluir.');
            return;
        }
        const confirmar =confirm('Tem certeza que deseja excluir este produto?');

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`/api/produtos/${id}`, {method: 'DELETE'});
            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem || 'Erro ao excluir produto.');
                return;
            }

            alert(dados.mensagem || 'Produto excluído com sucesso.');

            carregarProdutos();

        } catch (erro) {
            console.error('Erro ao excluir produto:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    }
);

// CARREGAR DADOS AO ABRIR A PÁGINA

carregarFornecedores();
carregarProdutos();