// js/autenticacao.js

function verificarAcessoAdmin() {
    const usuario = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');

    // Se não houver ninguém logado ou se o tipo não for admin, bloqueia
    if (!usuario || tipo !== 'admin') {
        alert("Acesso restrito! Apenas o administrador pode acessar esta página.");
        window.location.href = "dashboard_operador.html"; // Redireciona para a área permitida
    }
}

function verificarLogado() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) {
        window.location.href = "index.html"; // Volta para o login se não estiver logado
    }
}