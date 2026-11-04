console.log('AUTH.JS CARREGADO');

// VERIFICAR SESSÃO
async function verificarSessao() {

    try {
        const resposta = await fetch(
            '/api/sessao',
            {
                credentials: 'include'
            }
        );

        if (!resposta.ok) {
            window.location.href = 'login.html';
            return;

        }

        const dados = await resposta.json();

        console.log(
            'Usuário autenticado:',
            dados.usuario.nome
        );

    } catch (erro) {
        console.error( 'Erro ao verificar sessão:', erro);

        window.location.href = 'login.html';
    }
}

// LOGOUT
async function fazerLogout() {

    try {
        const resposta = await fetch(
            '/api/logout',
            {
                method: 'POST',
                credentials: 'include'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || 'Não foi possível sair do sistema.');
            return;
        }

        window.location.href = 'login.html';

    } catch (erro) {
        console.error('Erro ao fazer logout:', erro);
        alert('Não foi possível conectar ao servidor.');
    }
}

// BOTÃO SAIR
const btnLogout = document.querySelector('#btnLogout');

if (btnLogout) {
    btnLogout.addEventListener('click', fazerLogout);
}

// MENU RESPONSIVO

const btnMenu = document.querySelector('#btnMenu');
const menuPrincipal = document.querySelector('#menuPrincipal');

if (btnMenu && menuPrincipal) {

    btnMenu.addEventListener('click', () => {

        menuPrincipal.classList.toggle('menu-aberto');

        if (menuPrincipal.classList.contains('menu-aberto')) {
            btnMenu.textContent = '✕';
        } else {
            btnMenu.textContent = '☰';
        }

    });

}

// INICIAR VERIFICAÇÃO
verificarSessao();