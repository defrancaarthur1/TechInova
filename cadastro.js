const btnCadastrarFornecedor = document.querySelector('#btnCadastrarFornecedor');

btnCadastrarFornecedor.addEventListener('click', () => {

    const empresa = document.querySelector('#empresa').value.trim();
    const cnpj = document.querySelector('#cnpj').value.trim();

    if (!empresa || !cnpj) {
        alert('Preencha a empresa e o CNPJ.');
        return;
    }

    alert('Fornecedor cadastrado com sucesso!');

    document.querySelector('#empresa').value = '';
    document.querySelector('#cnpj').value = '';
    document.querySelector('#telefone').value = '';
    document.querySelector('#consultor').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#dataCadastro').value = '';
});