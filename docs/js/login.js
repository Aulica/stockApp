document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const btn = document.getElementById("btnEntrar");
        const msg = document.getElementById("mensagem");

        const usuario = form.usuario.value.trim();
        const senha = form.senha.value.trim();

        // 🔒 Validação básica
        if (!usuario || !senha) {
            mostrarErro(msg, "Preencha todos os campos!");
            return;
        }

        // 🔄 Estado de loading
        btn.disabled = true;
        btn.innerText = "Verificando...";

        msg.style.display = "block";
        msg.className = "alerta";
        msg.innerText = "Verificando credenciais...";

        // 📦 Dados
        const formData = new FormData();
        formData.append("usuario", usuario);
        formData.append("senha", senha);

        try {
            console.log("🔗 URL:", `${CONFIG.API_URL}/login.php`);

            const res = await fetch(`${CONFIG.API_URL}/login.php`, {
                method: "POST",
                body: formData
            });

            console.log("📡 STATUS:", res.status);

            if (!res.ok) {
                throw new Error("Erro HTTP: " + res.status);
            }

            const data = await res.json();
            console.log("📥 RESPOSTA:", data);

            // ✅ LOGIN OK
            if (data.status === "sucesso") {
                const tipo = (data.tipo || "").toLowerCase().trim();

                localStorage.setItem("usuarioLogado", data.usuario);
                localStorage.setItem("tipoUsuario", tipo);

                msg.className = "alerta sucesso";
                msg.innerText = "Login realizado com sucesso!";

                // 🔁 Redirecionamento
                setTimeout(() => {
                    if (tipo === "admin") {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "index.html";
                    }
                }, 800);

            } else {
                mostrarErro(msg, data.mensagem || "Erro no login");
                resetarBotao(btn);
            }

        } catch (err) {
            console.error("❌ ERRO REAL:", err);

            mostrarErro(msg, "Erro ao conectar ao servidor.");
            alert("Erro técnico: " + err.message);

            resetarBotao(btn);
        }
    });
});

// =========================
// 🔧 FUNÇÕES AUXILIARES
// =========================

function mostrarErro(msg, texto) {
    if (!msg) {
        alert(texto);
        return;
    }

    msg.innerText = texto;
    msg.className = "alerta erro";
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, 3000);
}

function resetarBotao(btn) {
    btn.disabled = false;
    btn.innerText = "Entrar";
}
