const btnFiltrar = document.querySelector('#btnFiltrar');

btnFiltrar.addEventListener('click', () => {

const fornecedor = document.querySelector('#filtroFornecedor').value;
const dataInicial = document.querySelector('#dataInicial').value;
const dataFinal = document.querySelector('#dataFinal').value;

const linhas = document.querySelectorAll('#tabelaHistorico tr');

linhas.forEach(linha => {

    const fornecedorLinha = linha.children[1].textContent;
    const dataLinha = linha.children[0].textContent;

    let mostrar = true;

    if (fornecedor !== 'todos' && fornecedorLinha !== fornecedor) {
        mostrar = false;
    }

    if (dataInicial || dataFinal) {

        const partes = dataLinha.split('/');

        const dataCompra = new Date(
            partes[2],
            partes[1] - 1,
            partes[0]
        );

        if (dataInicial) {
            const inicio = new Date(dataInicial);

            if (dataCompra < inicio) {
                mostrar = false;
            }
        }

        if (dataFinal) {
            const fim = new Date(dataFinal);

            if (dataCompra > fim) {
                mostrar = false;
            }
        }
    }

    linha.style.display = mostrar ? '' : 'none';
});

});