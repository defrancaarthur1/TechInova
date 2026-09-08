const formLogin = document.getElementById('formLogin');

const mensagemDeErro =
    document.getElementById('mensagemDeErro');

const mensagemLogin =
    document.getElementById('mensagemLogin');


formLogin.addEventListener('submit', async function (event) {

    event.preventDefault();

    const email =
        document.getElementById('email').value.trim();

    const senha =
        document.getElementById('senha').value;


    mensagemDeErro.textContent = '';
    mensagemLogin.textContent = '';


    try {

        const resposta = await fetch(
            'http://localhost:3000/api/login',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                credentials: 'include',

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            mensagemDeErro.textContent =
                dados.mensagem || 'E-mail ou senha incorretos.';

            return;
        }


        mensagemLogin.textContent =
            'Login realizado com sucesso!';


        setTimeout(function () {

            window.location.href = 'index.html';

        }, 800);


    } catch (erro) {

        console.error('Erro:', erro);

        mensagemDeErro.textContent =
            'Não foi possível conectar ao servidor.';
    }

});