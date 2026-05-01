(function verificarPermissao() {
    const usuario = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');

    if (!usuario || tipo !== 'admin') {
        alert("Acesso restrito!");
        window.location.href = "dashboard_operador.html"; // ✔️ corrigido
    }
})();

document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnCadastrar');
    const msg = document.getElementById('mensagem');

    btn.disabled = true;
    btn.innerText = "Cadastrando...";

    const formData = new FormData(this);

    fetch(`${CONFIG.API_URL}/cadastrar_usuario.php`, { // ✔️ CORRETO
        method: 'POST',
        body: formData
    })
    .then(async res => {
        const texto = await res.text();

        try {
            return JSON.parse(texto);
        } catch {
            console.error("Resposta inválida:", texto);
            throw new Error("Erro no servidor");
        }
    })
    .then(data => {
        msg.innerText = data.mensagem;
        msg.style.display = "block";

        if (data.status === "sucesso") {
            msg.className = "alerta sucesso";
            document.getElementById('formCadastro').reset();
        } else {
            msg.className = "alerta erro";
        }

        btn.disabled = false;
        btn.innerText = "Cadastrar";

        setTimeout(() => { msg.style.display = "none"; }, 4000);
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao conectar com o servidor!");
        btn.disabled = false;
        btn.innerText = "Cadastrar";
    });
});