// Histórico de compras: filtros locais sem alterar as rotas existentes.
let compras = [];
let fornecedores = [];

function dataISO(valor) {
    if (!valor) return '';
    // Evita deslocamento de um dia causado pelo fuso horário.
    if (typeof valor === 'string') return valor.slice(0, 10);
    const d = new Date(valor);
    return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function dataBR(valor) {
    const iso = dataISO(valor);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '-';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
}

function moeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

function adicionarCelula(linha, valor) {
    const td = document.createElement('td');
    td.textContent = String(valor ?? '');
    linha.appendChild(td);
    return td;
}

async function carregarFornecedores() {
    try {
        const resposta = await fetch('/api/fornecedores');
        if (!resposta.ok) throw new Error('Falha ao consultar fornecedores');
        const dados = await resposta.json();
        fornecedores = Array.isArray(dados.fornecedores) ? dados.fornecedores : [];
        atualizarOpcoesFornecedores();
    } catch (erro) {
        console.error('Erro ao carregar fornecedores:', erro);
        // Mantém o filtro utilizável com fornecedores das compras já carregadas.
        atualizarOpcoesFornecedores();
    }
}

function atualizarOpcoesFornecedores() {
    const select = document.getElementById('filtroFornecedor');
    const anterior = select.value;
    const nomes = new Set([
        ...fornecedores.map(f => f.empresa),
        ...compras.map(c => c.fornecedor)
    ].filter(Boolean));
    select.replaceChildren(new Option('Todos os fornecedores', ''));
    [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(nome => {
        select.add(new Option(nome, nome));
    });
    if ([...nomes].includes(anterior)) select.value = anterior;
}

async function carregarCompras() {
    try {
        const resposta = await fetch('/api/compras');
        const dados = await resposta.json();
        if (!resposta.ok || !Array.isArray(dados.compras)) {
            throw new Error(dados.mensagem || 'Resposta inválida da API');
        }
        compras = dados.compras;
        atualizarOpcoesFornecedores();
        aplicarFiltros();
    } catch (erro) {
        console.error('Erro ao carregar compras:', erro);
        document.getElementById('tabelaHistorico').innerHTML = '<tr><td colspan="6">Erro ao carregar o histórico.</td></tr>';
    }
}

function aplicarFiltros() {
    const fornecedor = document.getElementById('filtroFornecedor').value;
    const inicio = document.getElementById('filtroDataInicial').value;
    const fim = document.getElementById('filtroDataFinal').value;
    const mensagem = document.getElementById('mensagemFiltros');
    if (inicio && fim && inicio > fim) {
        mensagem.textContent = 'A data inicial não pode ser posterior à data final.';
        return;
    }
    mensagem.textContent = '';
    const filtradas = compras.filter(compra => {
        const data = dataISO(compra.data_compra);
        return (!fornecedor || compra.fornecedor === fornecedor) &&
            (!inicio || data >= inicio) && (!fim || data <= fim);
    });
    mostrarCompras(filtradas);
}

function mostrarCompras(lista) {
    const tabela = document.getElementById('tabelaHistorico');
    tabela.replaceChildren();
    let totalLinhas = 0;
    lista.forEach(compra => {
        (Array.isArray(compra.itens) ? compra.itens : []).forEach(item => {
            totalLinhas++;
            const linha = document.createElement('tr');
            adicionarCelula(linha, dataBR(compra.data_compra));
            adicionarCelula(linha, compra.fornecedor || 'Fornecedor não informado');
            adicionarCelula(linha, item.produto || 'Produto não informado');
            adicionarCelula(linha, Number(item.quantidade));
            adicionarCelula(linha, moeda(item.subtotal));
            const tdAcoes = document.createElement('td');
            const editar = document.createElement('button');
            editar.type = 'button';
            editar.className = 'btn edit';
            editar.textContent = 'Editar';
            editar.addEventListener('click', () => editarCompra(compra.compra_id));
            const excluir = document.createElement('button');
            excluir.type = 'button';
            excluir.className = 'btn delete';
            excluir.textContent = 'Excluir';
            excluir.addEventListener('click', () => excluirCompra(compra.compra_id));
            tdAcoes.append(editar, excluir);
            linha.appendChild(tdAcoes);
            tabela.appendChild(linha);
        });
    });
    if (!totalLinhas) {
        const linha = document.createElement('tr');
        adicionarCelula(linha, 'Nenhuma compra encontrada.').colSpan = 6;
        tabela.appendChild(linha);
    }
}

async function excluirCompra(id) {
    if (!confirm('Tem certeza que deseja excluir esta compra?')) return;
    try {
        const resposta = await fetch(`/api/compras/${id}`, { method: 'DELETE' });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao excluir compra.');
        alert(dados.mensagem || 'Compra excluída.');
        await carregarCompras();
    } catch (erro) {
        console.error('Erro ao excluir compra:', erro);
        alert(erro.message || 'Não foi possível excluir a compra.');
    }
}

function editarCompra(id) {
    window.location.href = `index.html?editar=${encodeURIComponent(id)}`;
}

document.getElementById('formFiltrosHistorico').addEventListener('submit', evento => {
    evento.preventDefault();
    aplicarFiltros();
});
document.getElementById('limparFiltros').addEventListener('click', () => {
    document.getElementById('formFiltrosHistorico').reset();
    aplicarFiltros();
});
Promise.all([carregarCompras(), carregarFornecedores()]);
