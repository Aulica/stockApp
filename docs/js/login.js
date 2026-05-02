document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const btn = document.getElementById("btnEntrar");
        const msg = document.getElementById("mensagem");

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

        const formData = new FormData();
        formData.append("usuario", usuario);
        formData.append("senha", senha);

        try {
            // ✔️ CONTROLLER CORRETO
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);

            console.log("URL:", `${CONFIG.API_URL}/login.php`);

            const res = await fetch(`${CONFIG.API_URL}/login.php`, {
                method: "POST",
                body: formData,
                signal: controller.signal,
                credentials: "include"
            });

            console.log("STATUS:", res.status);

            if (!res.ok) throw new Error("HTTP " + res.status);

            const data = await res.json();

            console.log("RESPOSTA:", data);

            if (data.status === "sucesso") {
                const tipo = (data.tipo || "").toLowerCase().trim();

                localStorage.setItem("usuarioLogado", data.usuario);
                localStorage.setItem("tipoUsuario", tipo);

                if (tipo === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "index.html";
                }
            } else {
                mostrarErro(msg, data.mensagem || "Erro no login");
                resetarBotao(btn);
            }

        } catch (err) {
            console.error("ERRO REAL:", err);
            alert("Erro real: " + err.message); // 🔥 AGORA VAI MOSTRAR O ERRO VERDADEIRO
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

    setTimeout(() => (msg.style.display = "none"), 3000);
}

function resetarBotao(btn) {
    btn.disabled = false;
    btn.innerText = "Entrar";
}
