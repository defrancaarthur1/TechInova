// Histórico de compras - TechInova
let compras = [];
let fornecedores = [];

const elemento = id => document.getElementById(id);
const texto = valor => String(valor ?? '');

function mostrarMensagem(mensagem) {
    const corpo = elemento('tabelaHistorico');
    if (!corpo) return;
    corpo.replaceChildren();
    const linha = corpo.insertRow();
    const celula = linha.insertCell();
    celula.colSpan = 6;
    celula.textContent = mensagem;
}

function dataLocal(valor) {
    if (!valor) return '';
    const parte = texto(valor).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(parte) ? parte : '';
}

function formatarData(valor) {
    const data = dataLocal(valor);
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarValor(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarOpcoesFornecedores() {
    const campo = elemento('filtroFornecedor');
    if (!campo) return;
    const selecionado = campo.value;
    const nomes = new Set();
    fornecedores.forEach(f => { if (f.empresa) nomes.add(texto(f.empresa)); });
    compras.forEach(c => { if (c.fornecedor) nomes.add(texto(c.fornecedor)); });
    campo.replaceChildren();
    const todos = document.createElement('option');
    todos.value = '';
    todos.textContent = 'Todos os fornecedores';
    campo.appendChild(todos);
    [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(nome => {
        const opcao = document.createElement('option');
        opcao.value = nome;
        opcao.textContent = nome;
        campo.appendChild(opcao);
    });
    campo.value = [...campo.options].some(o => o.value === selecionado) ? selecionado : '';
}

async function carregarFornecedores() {
    try {
        const resposta = await fetch('/api/fornecedores', { credentials: 'same-origin' });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        fornecedores = Array.isArray(dados.fornecedores) ? dados.fornecedores : [];
    } catch (erro) {
        console.warn('Não foi possível carregar a lista de fornecedores:', erro);
        fornecedores = [];
    }
    atualizarOpcoesFornecedores();
}

async function carregarCompras() {
    try {
        const resposta = await fetch('/api/compras', { credentials: 'same-origin' });
        if (resposta.status === 401) { window.location.href = 'login.html'; return; }
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
        const dados = await resposta.json();
        if (!Array.isArray(dados.compras)) throw new Error('Formato de resposta inesperado.');
        compras = dados.compras;
        atualizarOpcoesFornecedores();
        aplicarFiltros();
    } catch (erro) {
        console.error('Erro ao carregar compras:', erro);
        mostrarMensagem('Erro ao carregar o histórico. Consulte o Console.');
    }
}

function aplicarFiltros() {
    const fornecedor = elemento('filtroFornecedor')?.value || '';
    const inicial = elemento('filtroDataInicial')?.value || '';
    const final = elemento('filtroDataFinal')?.value || '';
    if (inicial && final && inicial > final) {
        mostrarMensagem('A data inicial não pode ser posterior à data final.');
        return;
    }
    const filtradas = compras.filter(compra => {
        const data = dataLocal(compra.data_compra);
        return (!fornecedor || texto(compra.fornecedor) === fornecedor) &&
               (!inicial || (data && data >= inicial)) &&
               (!final || (data && data <= final));
    });
    mostrarCompras(filtradas);
}

function mostrarCompras(lista) {
    const corpo = elemento('tabelaHistorico');
    if (!corpo) return;
    corpo.replaceChildren();
    if (!lista.length) { mostrarMensagem('Nenhuma compra encontrada.'); return; }
    lista.forEach(compra => {
        const itens = Array.isArray(compra.itens) && compra.itens.length ? compra.itens : [null];
        itens.forEach(item => {
            const linha = corpo.insertRow();
            const colunas = [
                formatarData(compra.data_compra),
                texto(compra.fornecedor || '-'),
                texto(item?.produto || '-'),
                texto(item?.quantidade ?? '-'),
                formatarValor(item?.subtotal ?? compra.valor_total)
            ];
            colunas.forEach(valor => { linha.insertCell().textContent = valor; });
            const acoes = linha.insertCell();
            const grupo = document.createElement('div');
            grupo.className = 'acoes-compra';
            const editar = document.createElement('button');
            editar.type = 'button'; editar.className = 'edit'; editar.textContent = 'Editar';
            editar.addEventListener('click', () => editarCompra(compra.compra_id));
            const excluir = document.createElement('button');
            excluir.type = 'button'; excluir.className = 'delete'; excluir.textContent = 'Excluir';
            excluir.addEventListener('click', () => excluirCompra(compra.compra_id));
            grupo.append(editar, excluir);
            acoes.appendChild(grupo);
        });
    });
}

async function excluirCompra(id) {
    if (!confirm('Tem certeza que deseja excluir esta compra?')) return;
    try {
        const resposta = await fetch(`/api/compras/${encodeURIComponent(id)}`, {
            method: 'DELETE', credentials: 'same-origin'
        });
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

function iniciarHistorico() {
    const form = elemento('formFiltrosHistorico');
    form?.addEventListener('submit', evento => { evento.preventDefault(); aplicarFiltros(); });
    elemento('limparFiltros')?.addEventListener('click', () => { form?.reset(); aplicarFiltros(); });
    ['filtroFornecedor', 'filtroDataInicial', 'filtroDataFinal'].forEach(id => {
        elemento(id)?.addEventListener('change', aplicarFiltros);
    });
    Promise.allSettled([carregarCompras(), carregarFornecedores()]);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarHistorico);
} else {
    iniciarHistorico();
}
