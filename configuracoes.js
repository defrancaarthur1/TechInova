async function carregarConta() {
    try {
        const resposta = await fetch('/api/usuarios/conta', { credentials: 'same-origin' });
        if (resposta.status === 401) return window.location.assign('login.html');
        if (!resposta.ok) throw new Error('Não foi possível consultar a conta.');
        const dados = await resposta.json();
        document.getElementById('nomeConta').textContent = dados.nome;
        document.getElementById('emailConta').textContent = dados.email;
    } catch (erro) { document.getElementById('mensagemGeral').textContent = erro.message; }
}
async function alterar(url, dados, elemento, botao) {
    elemento.textContent = '';
    botao.disabled = true;
    try {
        const resposta = await fetch(url, { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        const resultado = await resposta.json();
        if (!resposta.ok) { elemento.textContent = resultado.mensagem || 'Não foi possível salvar.'; return; }
        alert(resultado.mensagem);
        window.location.replace('login.html');
    } catch (erro) { elemento.textContent = 'Não foi possível conectar ao servidor.'; }
    finally { botao.disabled = false; }
}
document.getElementById('formEmail').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    await alterar('/api/usuarios/email', { novoEmail: document.getElementById('novoEmail').value.trim(), senhaAtual: document.getElementById('senhaEmail').value }, document.getElementById('mensagemEmail'), form.querySelector('button'));
});
document.getElementById('formSenha').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    if (novaSenha.length < 8 || !/[0-9]/.test(novaSenha) || !/[^A-Za-z0-9\s]/.test(novaSenha) || new TextEncoder().encode(novaSenha).length > 72) { document.getElementById('mensagemSenha').textContent = 'Use no mínimo 8 caracteres, pelo menos 1 número e 1 símbolo (máximo de 72 bytes).'; return; }
    if (novaSenha !== confirmarSenha) { document.getElementById('mensagemSenha').textContent = 'As senhas não coincidem.'; return; }
    await alterar('/api/usuarios/senha', { senhaAtual: document.getElementById('senhaAtual').value, novaSenha, confirmarSenha }, document.getElementById('mensagemSenha'), form.querySelector('button'));
});
carregarConta();
