document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('formLogin');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById('btnEntrar');
        const msg = document.getElementById('mensagem');

        const usuario = form.usuario.value.trim();
        const senha = form.senha.value.trim();

        if (!usuario || !senha) {
            mostrarErro(msg, "Preencha todos os campos!");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Verificando...";

        msg.style.display = "block";
        msg.className = "alerta";
        msg.innerText = "Verificando credenciais...";

        const formData = new FormData(form);

        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);

            const res = await fetch(`${CONFIG.API_URL}/login.php`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            if (!res.ok) throw new Error("HTTP " + res.status);

            const texto = await res.text();
            const data = JSON.parse(texto);

            if (data.status === "sucesso") {
                localStorage.setItem('usuarioLogado', data.usuario);
                localStorage.setItem('tipoUsuario', data.tipo);

                if (data.tipo === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "index.html";
                }

            } else {
                mostrarErro(msg, data.mensagem);
                resetarBotao(btn);
            }

        } catch (err) {
            console.error("Erro:", err);
            mostrarErro(msg, "Erro ao conectar ao servidor.");
            resetarBotao(btn);
        }
    });
});

// AUXILIARES
function mostrarErro(msg, texto) {
    if (!msg) {
        alert(texto);
        return;
    }

    msg.innerText = texto;
    msg.className = "alerta erro";
    msg.style.display = "block";

    setTimeout(() => msg.style.display = "none", 3000);
}

function resetarBotao(btn) {
    btn.disabled = false;
    btn.innerText = "Entrar";
}