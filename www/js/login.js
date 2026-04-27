 // ATUALIZADO COM O IP
const API_URL = "http://192.168.43.221/estoque_app/api/login.php";
            
document.addEventListener("deviceready", function() {
    if (navigator.splashscreen) {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 1000); 
    }
}, false);

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('formLogin');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = document.getElementById('btnEntrar');
            const msg = document.getElementById('mensagem');
           

            btn.disabled = true;
            btn.innerText = "Verificando...";

            const formData = new FormData(this);

            fetch(API_URL, {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (!res.ok) throw new Error('Servidor respondeu com erro ' + res.status);
                return res.json();
            })
            .then(data => {
                if (data.status === "sucesso") {
                    localStorage.setItem('usuarioLogado', data.usuario);
                    localStorage.setItem('tipoUsuario', data.tipo);
                    window.location.href = "admin.html";
                } else {
                    if (msg) {
                        msg.innerText = data.mensagem;
                        msg.className = "alerta erro";
                        msg.style.display = "block";
                        setTimeout(() => { msg.style.display = "none"; }, 3000);
                    } else {
                        alert(data.mensagem);
                    }
                    btn.disabled = false;
                    btn.innerText = "Entrar";
                }
            })
            .catch(err => {
                console.error("Erro detalhado:", err);
                // ALERTA CORRIGIDO: Mostra o IP que falhou e o erro real
                alert("Falha na conexão!\nURL: " + API_URL + "\nErro: " + err.message + "\n\nVerifique:\n1. Se o PC e Telemóvel estão no mesmo Wi-Fi.\n2. Se o Firewall do PC permite o Apache.");
                btn.disabled = false;
                btn.innerText = "Entrar";
            });
        });
    }
});

function fazerLogout() {
    if (confirm("Deseja realmente sair do aplicativo?")) {
        localStorage.clear(); 
        window.location.href = "login.html";
    }
}