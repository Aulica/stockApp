// 1. PEGAR O ID
const urlParams = new URLSearchParams(window.location.search);
let produtoId = urlParams.get('id');

if (!produtoId) {
    produtoId = localStorage.getItem('id_para_editar');
}

// 2. CARREGAR DADOS
if (produtoId) {
    fetch(`${CONFIG.API_URL}/get_produto.php?id=${produtoId}`)
        .then(async res => {
            const texto = await res.text();

            try {
                return JSON.parse(texto);
            } catch {
                console.error("Resposta inválida:", texto);
                throw new Error("Erro no servidor");
            }
        })
        .then(produto => {
            document.getElementById('input_id').value = produto.id || '';
            document.getElementById('input_referencia').value = produto.referencia || '';
            document.getElementById('input_balcao').value = produto.balcao || '';
            document.getElementById('input_armazem1').value = produto.armazem1 || '';
            document.getElementById('input_armazem2').value = produto.armazem2 || '';
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar dados.");
        });
} else {
    alert("Nenhum produto selecionado.");
    window.location.href = "admin.html";
}

// 3. SALVAR
document.getElementById('formEditar').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!navigator.onLine) {
        alert("Sem internet!");
        return;
    }

    const btn = document.getElementById('btnSalvar');
    btn.disabled = true;
    btn.innerText = "Atualizando...";

    const formData = new FormData(this);

    fetch(`${CONFIG.API_URL}/atualizar.php`, {
        method: "POST",
        body: formData
    })
    .then(async res => {
        const texto = await res.text();

        try {
            return JSON.parse(texto);
        } catch {
            console.error("Resposta inválida:", texto);
            throw new Error("Erro no servidor");
        }
    })
    .then(data => {
        if (data.status === "sucesso") {
            alert("Atualizado com sucesso!");
            localStorage.removeItem('id_para_editar');
            window.location.href = "admin.html";
        } else {
            alert("Erro: " + data.mensagem);
            btn.disabled = false;
            btn.innerText = "Salvar Alterações";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Erro de conexão ao salvar.");
        btn.disabled = false;
        btn.innerText = "Salvar Alterações";
    });
});