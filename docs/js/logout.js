function fazerLogout() {
    if (!confirm("Tem certeza que deseja sair do sistema?")) return;

    // 1. Limpa local imediatamente
    localStorage.clear();

    // 2. Tenta avisar o servidor (sem bloquear navegação)
    fetch(`${CONFIG.API_URL}/logout.php`, {
        method: "GET",
        keepalive: true // ✔️ importante para não cancelar ao sair
    }).catch(() => {
        console.log("Servidor não respondeu, logout local feito.");
    });

    // 3. Redireciona
    window.location.href = "index.html";
}