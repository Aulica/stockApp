document.addEventListener("DOMContentLoaded", () => {
    carregarDadosPerfil();
    configurarUploadFoto();
});

async function carregarDadosPerfil() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/get_perfil.php`, {
            credentials: 'include' // ✔️ necessário para sessão PHP
        });

        const texto = await response.text();

        let result;
        try {
            result = JSON.parse(texto);
        } catch {
            console.error("Resposta inválida:", texto);
            throw new Error("Erro no servidor");
        }

        if (result.status === "sucesso") {
            const u = result.dados;

            document.getElementById('exibirNome').textContent = u.nome || "";
            document.getElementById('nome').textContent = u.nome || "";
            document.getElementById('email').textContent = u.email || "";
            document.getElementById('telefone').textContent = u.telefone || "Não cadastrado";
            document.getElementById('genero').textContent = u.genero || "";
            document.getElementById('exibirFuncao').textContent = u.funcao || "";

            if (u.foto) {
                document.getElementById('fotoPerfil').src = `img/perfil/${u.foto}`;
            }

        } else {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "index.html";
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar perfil.");
    }
}