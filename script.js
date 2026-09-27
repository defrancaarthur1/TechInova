console.log('SCRIPT.JS CARREGADO');

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const selectFornecedor = document.querySelector('#fornecedor');
const selectProduto = document.querySelector('#produto');
const campoValor = document.querySelector('#valor');

let itensCompra = [];


// ==========================================
// CARREGAR FORNECEDORES
// ==========================================

async function carregarFornecedores() {

    if (!selectFornecedor) {
        return;
    }

    try {

        const resposta = await fetch('/api/fornecedores');
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error('Erro ao buscar fornecedores:', dados.mensagem);
            return;
        }

        selectFornecedor.innerHTML = `
            <option value="">Selecione o fornecedor</option>
        `;

        dados.fornecedores.forEach(fornecedor => {

            const option = document.createElement('option');

            option.value = fornecedor.id;
            option.textContent = fornecedor.empresa;

            selectFornecedor.appendChild(option);
        });

    } catch (erro) {

        console.error('Erro ao carregar fornecedores:', erro);

    }
}


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    if (!selectProduto) {
        return;
    }

    try {

        const resposta = await fetch('/api/produtos');
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error('Erro ao buscar produtos:', dados.mensagem);
            return;
        }

        selectProduto.innerHTML = `
            <option value="">Selecione o produto</option>
        `;

        dados.forEach(produto => {

            const option = document.createElement('option');

            option.value = produto.id;
            option.textContent = produto.nome;

            selectProduto.appendChild(option);
        });

    } catch (erro) {

        console.error('Erro ao carregar produtos:', erro);

    }
}


// ==========================================
// CARREGAR DADOS AO ABRIR A PÁGINA
// ==========================================

Promise.all([
    carregarFornecedores(),
    carregarProdutos()
]).then(() => {

    verificarEdicao();

});


// ==========================================
// INFORMAÇÕES DO FORNECEDOR
// ==========================================

async function mostrarInformacoesFornecedor() {

    const id = selectFornecedor.value;

    if (!id) {

        document.querySelector('#infoEmpresa').textContent =
            'Selecione um fornecedor';

        document.querySelector('#infoCnpj').textContent = '-';
        document.querySelector('#infoTelefone').textContent = '-';
        document.querySelector('#infoConsultor').textContent = '-';
        document.querySelector('#infoCadastro').textContent = '-';
        document.querySelector('#infoEmail').textContent = '-';

        return;
    }

    try {

        const resposta = await fetch('/api/fornecedores');
        const dados = await resposta.json();

        const fornecedor = dados.fornecedores.find(
            item => item.id == id
        );

        if (!fornecedor) {

            alert('Fornecedor não encontrado.');
            return;

        }

        document.querySelector('#infoEmpresa').textContent =
            fornecedor.empresa || '-';

        document.querySelector('#infoCnpj').textContent =
            fornecedor.cnpj || '-';

        document.querySelector('#infoTelefone').textContent =
            fornecedor.telefone || '-';

        document.querySelector('#infoConsultor').textContent =
            fornecedor.consultor || '-';

        document.querySelector('#infoEmail').textContent =
            fornecedor.email || '-';

        if (fornecedor.data_cadastro) {

            document.querySelector('#infoCadastro').textContent =
                fornecedor.data_cadastro.substring(0, 10);

        } else {

            document.querySelector('#infoCadastro').textContent = '-';

        }

        document.querySelector('#informacoesFornecedor').style.display =
            'block';

    } catch (erro) {

        console.error(
            'Erro ao buscar informações do fornecedor:',
            erro
        );

        alert(
            'Não foi possível carregar as informações do fornecedor.'
        );

    }
}


// ==========================================
// ADICIONAR PRODUTO À COMPRA
// ==========================================

function adicionarProduto() {

    const produtoId = selectProduto.value;

    const produtoNome =
        selectProduto.options[selectProduto.selectedIndex]?.textContent;

    const quantidade =
        Number(document.querySelector('#quantidade').value);

    const valorUnitario =
        Number(
            document.querySelector('#valor').value.replace(',', '.')
        );


    // VALIDAÇÕES

    if (!produtoId) {

        alert('Selecione um produto.');
        return;

    }

    if (!quantidade || quantidade <= 0) {

        alert('Informe uma quantidade válida.');
        return;

    }

    if (!valorUnitario || valorUnitario <= 0) {

        alert('Informe um valor unitário válido.');
        return;

    }


    // CALCULAR SUBTOTAL

    const subtotal = quantidade * valorUnitario;


    // ADICIONAR ITEM

    itensCompra.push({

        produto_id: produtoId,
        produto_nome: produtoNome,
        quantidade: quantidade,
        valor_unitario: valorUnitario,
        subtotal: subtotal

    });


    // ATUALIZAR TABELA

    atualizarListaItens();


    // LIMPAR CAMPOS

    selectProduto.value = '';
    document.querySelector('#quantidade').value = '';
    document.querySelector('#valor').value = '';

}


// ==========================================
// ATUALIZAR TABELA DE ITENS
// ==========================================

function atualizarListaItens() {

    const lista = document.querySelector('#listaItens');

    if (!lista) {
        return;
    }


    // NENHUM ITEM

    if (itensCompra.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum produto adicionado.
                </td>
            </tr>
        `;

        const elementoTotal =
            document.querySelector('#totalCompra');

        if (elementoTotal) {
            elementoTotal.textContent = 'R$ 0,00';
        }

        return;
    }


    // MONTAR TABELA

    lista.innerHTML = '';

    itensCompra.forEach(item => {

        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${item.produto_nome}</td>

            <td>${item.quantidade}</td>

            <td>
                R$ ${item.valor_unitario
                    .toFixed(2)
                    .replace('.', ',')}
            </td>

            <td>
                R$ ${item.subtotal
                    .toFixed(2)
                    .replace('.', ',')}
            </td>
        `;

        lista.appendChild(linha);

    });


    // CALCULAR TOTAL

    const total = itensCompra.reduce(
        (soma, item) => soma + item.subtotal,
        0
    );

    const elementoTotal =
        document.querySelector('#totalCompra');

    if (elementoTotal) {

        elementoTotal.textContent =
            `R$ ${total.toFixed(2).replace('.', ',')}`;

    }

}


// ==========================================
// CAMPO DE VALOR UNITÁRIO
// ==========================================

if (campoValor) {

    campoValor.addEventListener('input', () => {

        let valor = campoValor.value.replace(/\D/g, '');

        if (!valor) {
            valor = '0';
        }

        valor = valor.padStart(3, '0');

        const centavos = valor.slice(-2);
        const reais = valor.slice(0, -2);

        campoValor.value = `${Number(reais)},${centavos}`;

    });

}


// ==========================================
// VERIFICAR SE É EDIÇÃO
// ==========================================

async function verificarEdicao() {

    const parametros =
        new URLSearchParams(window.location.search);

    const idCompra = parametros.get('editar');


    // NOVA COMPRA

    if (!idCompra) {
        return;
    }


    try {

        const resposta = await fetch('/api/compras');
        const dados = await resposta.json();

        if (!resposta.ok) {

            alert('Não foi possível carregar as compras.');
            return;

        }


        const compra = dados.compras.find(
            item => item.compra_id == idCompra
        );


        if (!compra) {

            alert('Compra não encontrada.');
            return;

        }


        // ALTERAR TÍTULO

        const titulo =
            document.querySelector('.principal h2');

        if (titulo) {
            titulo.textContent = 'Editar Compra';
        }


        // PREENCHER FORNECEDOR

        document.querySelector('#fornecedor').value =
            compra.fornecedor_id || '';


        // PREENCHER DATA

        document.querySelector('#data').value =
            compra.data_compra.substring(0, 10);


        // LIMPAR ITENS

        itensCompra = [];


        // CARREGAR ITENS DA COMPRA

        compra.itens.forEach(item => {

            itensCompra.push({

                produto_id: String(item.produto_id),
                produto_nome: item.produto,
                quantidade: Number(item.quantidade),
                valor_unitario: Number(item.valor_unitario),
                subtotal: Number(item.subtotal)

            });

        });


        // PREENCHER FORMULÁRIO COM O PRIMEIRO ITEM

        if (compra.itens.length > 0) {

            const primeiroItem = compra.itens[0];

            document.querySelector('#produto').value =
                String(primeiroItem.produto_id);

            document.querySelector('#quantidade').value =
                Number(primeiroItem.quantidade);

            document.querySelector('#valor').value =
                Number(primeiroItem.valor_unitario)
                    .toFixed(2)
                    .replace('.', ',');

        }


        // MOSTRAR ITENS

        atualizarListaItens();


        // ALTERAR BOTÃO

        const botao =
            document.querySelector('#btnRegistrarCompra');

        if (botao) {

            botao.textContent = 'Salvar alterações';

            botao.classList.remove('success');
            botao.classList.add('edit');

        }


        // MOSTRAR BOTÃO CANCELAR

        const cancelar =
            document.querySelector('#btnCancelarEdicao');

        if (cancelar) {

            cancelar.style.display = 'inline-block';

            cancelar.onclick = () => {

                window.location.href =
                    'historico.html';

            };

        }

    } catch (erro) {

        console.error(
            'Erro ao carregar compra para edição:',
            erro
        );

        alert(
            'Não foi possível carregar a compra para edição.'
        );

    }

}


// ==========================================
// SALVAR EDIÇÃO DA COMPRA
// ==========================================

async function salvarEdicao(idCompra) {

    const fornecedorId =
        document.querySelector('#fornecedor').value;

    const dataCompra =
        document.querySelector('#data').value;


    // VALIDAÇÕES

    if (!fornecedorId) {

        alert('Selecione um fornecedor.');
        return;

    }

    if (!dataCompra) {

        alert('Informe a data da compra.');
        return;

    }

    if (itensCompra.length === 0) {

        alert('Adicione pelo menos um produto à compra.');
        return;

    }


    // PEGAR DADOS DO FORMULÁRIO

    const produtoId =
        document.querySelector('#produto').value;

    const quantidade =
        Number(document.querySelector('#quantidade').value);

    const valorUnitario =
        Number(
            document.querySelector('#valor').value.replace(',', '.')
        );


    if (!produtoId) {

        alert('Selecione um produto.');
        return;

    }

    if (!quantidade || quantidade <= 0) {

        alert('Informe uma quantidade válida.');
        return;

    }

    if (!valorUnitario || valorUnitario <= 0) {

        alert('Informe um valor unitário válido.');
        return;

    }


    // NOME DO PRODUTO

    const produtoNome =
        selectProduto.options[selectProduto.selectedIndex]?.textContent;


    // ATUALIZAR PRIMEIRO ITEM

    itensCompra[0] = {

        produto_id: produtoId,
        produto_nome: produtoNome,
        quantidade: quantidade,
        valor_unitario: valorUnitario,
        subtotal: quantidade * valorUnitario

    };


    atualizarListaItens();


    // DADOS DA COMPRA

    const dadosCompra = {

        fornecedor_id: fornecedorId,
        data_compra: dataCompra,

        itens: itensCompra.map(item => ({

            produto_id: item.produto_id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario

        }))

    };


    try {

        const resposta =
            await fetch(`/api/compras/${idCompra}`, {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dadosCompra)

            });


        const dados = await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                'Erro ao atualizar compra.'
            );

            return;

        }


        alert(dados.mensagem);

        window.location.href = 'historico.html';

    } catch (erro) {

        console.error(
            'Erro ao salvar edição:', erro);
        alert('Não foi possível atualizar a compra.');
    }
}

// REGISTRAR OU EDITAR COMPRA
const btnRegistrarCompra = document.querySelector('#btnRegistrarCompra');

if (btnRegistrarCompra) {

    btnRegistrarCompra.addEventListener(
        'click',
        async () => {
            const parametros = new URLSearchParams(window.location.search);
            const idCompra = parametros.get('editar');

            // EDIÇÃO
            if (idCompra) {
                await salvarEdicao(idCompra);
                return;
            }

            // NOVA COMPRA
            const fornecedorId = document.querySelector('#fornecedor').value;
            const dataCompra = document.querySelector('#data').value;

            // VALIDAR FORNECEDOR
            if (!fornecedorId) {

                alert('Selecione um fornecedor.');
                return;
            }

            // VALIDAR DATA
            if (!dataCompra) {

                alert('Informe a data da compra.');
                return;
            }

            // VALIDAR PRODUTOS
            if (itensCompra.length === 0) {
                alert('Adicione pelo menos um produto à compra.');
                return;
            }

            // DADOS DA COMPRA
            const dadosCompra = {
                fornecedor_id: fornecedorId,
                data_compra: dataCompra,

                itens: itensCompra.map(item => ({

                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                }))
            };

            try {
                const resposta =
                    await fetch('/api/compras', {

                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(dadosCompra)
                    });

                const dados = await resposta.json();

                if (!resposta.ok) {
                    alert(dados.mensagem || 'Erro ao registrar compra.');
                    return;
                }

                alert(dados.mensagem);

                // LIMPAR ITENS
                itensCompra = [];

                atualizarListaItens();

                // LIMPAR CAMPOS
                selectProduto.value = '';
                document.querySelector('#quantidade').value = '';
                document.querySelector('#valor').value = '0,00';

            } catch (erro) {
                console.error('Erro ao registrar compra:', erro);
                alert('Não foi possível registrar a compra.');
            }
        }
    );
}