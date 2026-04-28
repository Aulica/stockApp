const API_URL = "http://192.168.43.221/estoque_app/api";

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosPerfil();
    configurarUploadFoto();
});

async function carregarDadosPerfil() {
    try {
        const response = await fetch(`${API_URL}/get_perfil.php`);
        const result = await response.json();

        if (result.status === "sucesso") {
            const u = result.dados;

            // Atualização dinâmica do DOM
            document.getElementById('exibirNome').textContent = u.nome;
            document.getElementById('nome').textContent = u.nome;
            document.getElementById('email').textContent = u.email;
            document.getElementById('telefone').textContent = u.telefone || "Não cadastrado";
            document.getElementById('genero').textContent = u.genero;
            document.getElementById('exibirFuncao').textContent = u.funcao;

            if (u.foto) {
                document.getElementById('fotoPerfil').src = `img/perfil/${u.foto}`;
            }
        }
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// Lógica de Troca de Senha com validação profissional
document.getElementById('formSenha').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputs = e.target.querySelectorAll('input[type="password"]');
    const senhaAtual = inputs[0].value;
    const novaSenha = inputs[1].value;
    const confirmaSenha = inputs[2].value;

    if (novaSenha.length < 6) {
        alert("A nova senha deve ter no mínimo 6 caracteres.");
        return;
    }

    if (novaSenha !== confirmaSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    // Exemplo de envio para API
    console.log("Enviando atualização de senha...");
    alert("Senha validada com sucesso!");
});

function configurarUploadFoto() {
    document.getElementById('upload-foto').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => document.getElementById('fotoPerfil').src = e.target.result;
            reader.readAsDataURL(this.files[0]);
            // Aqui dispararias o fetch para salvar a foto no servidor
        }
    });
}