function verificarAcessoAdmin() {
    const usuario = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');

    // 🔒 Se não estiver logado → manda para login
    if (!usuario) {
        redirecionarSeNecessario("login.html");
        return;
    }

    // 🔒 Se não for admin → manda para área correta
    if (tipo !== 'admin') {
        redirecionarSeNecessario("index.html");
        return;
    }
}

function verificarLogado() {
    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
        redirecionarSeNecessario("login.html");
    }
}

// 🚫 evita loop infinito
function redirecionarSeNecessario(destino) {
    if (!window.location.pathname.includes(destino)) {
        window.location.href = destino;
    }
}
