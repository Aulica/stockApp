// 1. PEGAR O ID (Tenta URL primeiro, depois LocalStorage)
const urlParams = new URLSearchParams(window.location.search);
let produtoId = urlParams.get('id');

// Se a URL falhou (comum no Android), tenta o LocalStorage
if (!produtoId) {
    produtoId = localStorage.getItem('id_para_editar');
}

// ATENÇÃO: Verifique se o IP é o atual do seu PC!
const API_BASE = "http://192.168.43.221/estoque_app/api"; 

// 2. BUSCAR DADOS ASSIM QUE A PÁGINA CARREGAR
if (produtoId) {
    fetch(`${API_BASE}/get_produto.php?id=${produtoId}`)
        .then(res => res.json())
        .then(produto => {
            // Preenche os campos (Certifique-se que os IDs dos inputs no HTML são estes mesmos)
            document.getElementById('input_id').value = produto.id;
            document.getElementById('input_referencia').value = produto.referencia;
            document.getElementById('input_balcao').value = produto.balcao;
            document.getElementById('input_armazem1').value = produto.armazem1;
            document.getElementById('input_armazem2').value = produto.armazem2;
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar dados. Verifique a conexão com o PC.");
        });
} else {
    alert("Nenhum ID de produto encontrado.");
    window.location.href = "admin.html";
}

// 3. LÓGICA DE SALVAR
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

    fetch(`${API_BASE}/atualizar.php`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "sucesso") {
            alert("✅ Atualizado com sucesso!");
            // Limpa o ID do bolso para não confundir na próxima
            localStorage.removeItem('id_para_editar');
            window.location.href = "admin.html";
        } else {
            alert("Erro: " + data.mensagem);
            btn.disabled = false;
            btn.innerText = "Salvar Alterações";
        }
    })
    .catch(err => {
        alert("Erro de conexão ao salvar.");
        btn.disabled = false;
    });
});