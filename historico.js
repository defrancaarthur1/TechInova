console.log('HISTORICO.JS CARREGADO');
let compras = [];

// CARREGAR COMPRAS
async function carregarCompras() {

    try {
        const resposta = await fetch('/api/compras');
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error(dados.mensagem);
            return;
        }

        compras = dados.compras;
        mostrarCompras(compras);

    } catch (erro) {
        console.error( 'Erro ao carregar compras:', erro);

        const tabela = document.querySelector('#tabelaHistorico');

        if (tabela) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">
                        Erro ao carregar o histórico.
                    </td>
                </tr>
            `;
        }
    }
}

// MOSTRAR COMPRAS
function mostrarCompras(lista) {
    const tabela = document.querySelector('#tabelaHistorico');

    if (!tabela) {
        return;
    }

    tabela.innerHTML = '';

    if (lista.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma compra encontrada.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(compra => {

        compra.itens.forEach(item => {
            const linha = document.createElement('tr');
            const data = new Date(compra.data_compra);
            const dataFormatada = data.toLocaleDateString('pt-BR');

            linha.innerHTML = `
                <td>${dataFormatada}</td>

                <td>${compra.fornecedor}</td>
                <td>${item.produto}</td>

                <td>${Number(item.quantidade)}</td>

                <td>
                    R$ ${Number(item.subtotal)
                        .toFixed(2)
                        .replace('.', ',')}
                </td>

                <td>

                    <button
                        class="btn edit"
                        onclick="editarCompra(${compra.compra_id})">
                        Editar
                    </button>

                    <button
                        class="btn delete"
                        onclick="excluirCompra(${compra.compra_id})">
                        Excluir
                    </button>

                </td>
            `;

            tabela.appendChild(linha);
        });
    });
}

// EXCLUIR COMPRA
async function excluirCompra(id) {
    const confirmar = confirm('Tem certeza que deseja excluir esta compra?');

    if (!confirmar) {
        return;
    }

    try {
        const resposta =
            await fetch(`/api/compras/${id}`, {
                method: 'DELETE'
            });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || 'Erro ao excluir compra.');
            return;
        }

        alert(dados.mensagem);
        await carregarCompras();

    } catch (erro) {
        console.error('Erro ao excluir compra:', erro);
        alert('Não foi possível excluir a compra.');
    }
}

// EDITAR COMPRA
function editarCompra(id) {
    window.location.href = `index.html?editar=${id}`;
}

// INICIAR
carregarCompras();