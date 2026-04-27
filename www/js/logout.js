function fazerLogout() {
    // 1. Confirmação amigável
    if (confirm("Tem certeza que deseja sair do sistema?")) {
        
        // 2. Limpeza imediata dos dados locais
        // Fazemos isso primeiro para garantir que, mesmo sem internet, o acesso seja removido
        localStorage.clear(); 

        // 3. Tentativa de avisar o servidor (com ajuste de segurança e tempo)
        // Alterado para http (a menos que você tenha configurado SSL no XAMPP)
        const API_LOGOUT = "http://192.168.43.221/estoque_app/api/logout.php";

        // Usamos um truque: redirecionamos quase instantaneamente 
        // para não deixar o usuário esperando o servidor responder
        fetch(API_LOGOUT).catch(err => console.log("Servidor offline, mas saiu localmente."));

        // 4. Redirecionamento rápido
        // Verifique se o seu arquivo é index.html ou login.html
        window.location.href = "index.html";
    }
}