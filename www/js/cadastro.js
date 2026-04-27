/*(function verificarPermissao() {
    const usuario = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');

    // Só quem é admin pode ver esta tela
    if (!usuario || tipo !== 'admin') {
        alert("Acesso restrito!");
        window.location.href = "admin.html";
    }
})();*/

document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnCadastrar');
    const msg = document.getElementById('mensagem');
    const API_URL = "http://192.168.43.221/estoque_app/api/cadastrar_usuario.php";

    btn.disabled = true;
    btn.innerText = "Cadastrando...";

    const formData = new FormData(this);

    fetch(API_URL, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        msg.innerText = data.mensagem;
        msg.style.display = "block";
        
        if (data.status === "sucesso") {
            msg.className = "alerta sucesso";
            document.getElementById('formCadastro').reset(); // Limpa os campos
        } else {
            msg.className = "alerta erro";
        }

        btn.disabled = false;
        btn.innerText = "Cadastrar";

        // Esconde a mensagem após 4 segundos
        setTimeout(() => { msg.style.display = "none"; }, 4000);
    })
    .catch(err => {
        alert("Erro ao conectar com o servidor!");
        btn.disabled = false;
        btn.innerText = "Cadastrar";
    });
});

const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value, // Novo
    genero: document.getElementById('genero').value,     // Novo
    senha: document.getElementById('senha').value
};