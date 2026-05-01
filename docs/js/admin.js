const CONFIG = {
    API_URL: "https://a-stock.rf.gd/api"
};

let dadosParaConfirmar = null;

// INIT
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    configurarEventos();
});

// EVENTOS
function configurarEventos() {
    const btnSim = document.getElementById('btnSim');
    const btnNao = document.getElementById('btnNao');
    const form = document.getElementById("formProduto");
    const inputBusca = document.getElementById("buscarProduto");

    if (btnSim) {
        btnSim.addEventListener('click', () => {
            if (dadosParaConfirmar) {
                dadosParaConfirmar.set('confirmado', 'sim');
                dadosParaConfirmar.delete('id');
                fecharModalConfirmacao();
                enviarDadosAoServidor(dadosParaConfirmar);
            }
        });
    }

    if (btnNao) btnNao.addEventListener('click', fecharModalConfirmacao);

    if (form) {
        form.addEventListener("submit", salvarProduto);
    }

    // 🔍 BUSCA LOCAL NA TABELA
    if (inputBusca) {
        inputBusca.addEventListener("input", function () {
            const termo = this.value.toLowerCase();
            const linhas = document.querySelectorAll("#tabelaProdutos tr");

            linhas.forEach(linha => {
                const texto = linha.innerText.toLowerCase();
                linha.style.display = texto.includes(termo) ? "" : "none";
            });
        });
    }
}

// =========================
// 📦 LISTAGEM
// =========================
function carregarDados() {
    const tabela = document.getElementById("tabelaProdutos");
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "block";
        loading.innerText = "Carregando...";
    }

    fetch(`${CONFIG.API_URL}/carregar_produtos.php?t=${Date.now()}`)
        .then(res => {
            if (!res.ok) throw new Error("Erro HTTP: " + res.status);
            return res.text();
        })
        .then(html => {
            if (tabela) tabela.innerHTML = html;
        })
        .catch(err => {
            console.error("Erro ao carregar:", err);
            if (tabela) {
                tabela.innerHTML = `
                    <tr>
                        <td colspan="6" style="color:red;text-align:center;">
                            Erro ao conectar ao servidor
                        </td>
                    </tr>
                `;
            }
        })
        .finally(() => {
            if (loading) loading.style.display = "none";
        });
}

// =========================
// 💾 SALVAR
// =========================
function salvarProduto(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const btn = document.getElementById("btnSalvar");

    if (btn && btn.innerText !== "Atualizar Produto") {
        formData.delete('id');
    }

    formData.set('confirmado', 'nao');

    enviarDadosAoServidor(formData, form);
}

function enviarDadosAoServidor(formData, formElement = null) {
    const btn = document.getElementById("btnSalvar");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Salvando...";
    }

    fetch(`${CONFIG.API_URL}/cadastrar_produto.php`, {
        method: 'POST',
        body: formData
    })
    .then(async res => {
        const texto = await res.text();

        try {
            return JSON.parse(texto);
        } catch {
            console.error("Resposta inválida do servidor:", texto);
            throw new Error("Erro no JSON");
        }
    })
    .then(data => {
        if (data.status === "confirmacao") {
            dadosParaConfirmar = formData;
            abrirModalConfirmacao(data.mensagem);
        } 
        else if (data.status === "sucesso") {
            mostrarAlerta(data.mensagem, "sucesso");

            if (formElement) formElement.reset();

            carregarDados();
        } 
        else {
            mostrarAlerta(data.mensagem, "erro");
        }
    })
    .catch(err => {
        console.error(err);
        mostrarAlerta("Falha na comunicação com o servidor.", "erro");
    })
    .finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Salvar Referência";
        }
    });
}

// =========================
// 🧠 UI
// =========================
function abrirModalConfirmacao(msg) {
    document.getElementById('modalMensagem').innerText = msg;
    document.getElementById('modalConfirmacao').style.display = "flex";
}

function fecharModalConfirmacao() {
    document.getElementById('modalConfirmacao').style.display = "none";
}

function mostrarAlerta(msg, tipo) {
    const alerta = document.getElementById("mensagemFeedback");
    if (!alerta) return;

    alerta.innerText = msg;
    alerta.className = `alerta ${tipo}`;
    alerta.style.display = "block";

    setTimeout(() => {
        alerta.style.display = "none";
    }, 4000);
}

// =========================
// 🗑️ ELIMINAR
// =========================
function eliminarProduto(id) {
    if (!id) return;

    if (confirm("Deseja realmente apagar este produto?")) {
        fetch(`${CONFIG.API_URL}/eliminar.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "sucesso") {
                    mostrarAlerta("Produto eliminado!", "sucesso");
                    carregarDados();
                } else {
                    mostrarAlerta(data.mensagem || "Erro ao eliminar", "erro");
                }
            })
            .catch(() => {
                mostrarAlerta("Erro de conexão", "erro");
            });
    }
}

// =========================
// ✏️ EDITAR
// =========================
function editarProduto(id) {
    if (!id) return;

    localStorage.setItem('id_para_editar', id);
    window.location.href = "editar_produto.html";
}