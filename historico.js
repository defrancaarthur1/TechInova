// Histórico de compras: filtros locais sem alterar as rotas existentes.
let compras = [];
let fornecedores = [];

function dataISO(valor) {
    if (!valor) return '';
    const texto = String(valor);
    // MySQL pode retornar YYYY-MM-DD ou uma data ISO com horário UTC.
    const iso = texto.match(/^(\d{4}-\d{2}-\d{2})/);
    if (iso) return iso[1];
    const br = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function normalizarNome(valor) {
    return String(valor ?? '').trim().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
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
    // Filtra pelo ID do fornecedor, sem depender de diferenças de escrita no nome.
    const opcoes = new Map();
    fornecedores.forEach(f => {
        if (f.id != null) opcoes.set(String(f.id), String(f.empresa || `Fornecedor ${f.id}`));
    });
    compras.forEach(c => {
        if (c.fornecedor_id != null && !opcoes.has(String(c.fornecedor_id))) {
            opcoes.set(String(c.fornecedor_id), String(c.fornecedor || `Fornecedor ${c.fornecedor_id}`));
        }
    });
    select.replaceChildren(new Option('Todos os fornecedores', ''));
    [...opcoes].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .forEach(([id, nome]) => select.add(new Option(nome, id)));
    if (opcoes.has(anterior)) select.value = anterior;
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
    const fornecedorId = document.getElementById('filtroFornecedor').value;
    const inicio = document.getElementById('filtroDataInicial').value;
    const fim = document.getElementById('filtroDataFinal').value;
    const mensagem = document.getElementById('mensagemFiltros');
    if (inicio && fim && inicio > fim) {
        mensagem.textContent = 'A data inicial não pode ser posterior à data final.';
        mostrarCompras([]);
        return;
    }
    const filtradas = compras.filter(compra => {
        const data = dataISO(compra.data_compra);
        const correspondeFornecedor = !fornecedorId || String(compra.fornecedor_id) === fornecedorId;
        return correspondeFornecedor && (!inicio || data >= inicio) && (!fim || data <= fim);
    });
    mostrarCompras(filtradas);
    mensagem.textContent = `${filtradas.length} compra(s) encontrada(s).`;
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
// Também atualiza a listagem ao alterar qualquer campo, sem precisar clicar em Filtrar.
['filtroFornecedor', 'filtroDataInicial', 'filtroDataFinal'].forEach(id => {
    document.getElementById(id).addEventListener('change', aplicarFiltros);
});
Promise.all([carregarCompras(), carregarFornecedores()]);
