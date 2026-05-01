function verificarAcessoAdmin() {
    const usuario = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');

    if (!usuario || tipo !== 'admin') {
        alert("Acesso restrito! Apenas administrador.");
        window.location.href = "dashboard_operador.html";
        return;
    }
}

function verificarLogado() {
    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }
}