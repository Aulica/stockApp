// CONFIGURAÇÃO: Use HTTP. O HTTPS em IP local causa o erro que você está vendo.
const API_URL = "http://192.168.43.221/estoque_app/api"; 
let dadosParaConfirmar = null;

document.addEventListener("DOMContentLoaded", () => {
    // Tenta carregar os dados assim que a página abre
    carregarDados(true);

    // Lógica da Modal
    const btnSim = document.getElementById('btnSim');
    if (btnSim) {
        btnSim.addEventListener('click', () => {
            if (dadosParaConfirmar) {
                dadosParaConfirmar.set('confirmado', 'sim');
                // IMPORTANTE: Ao deletar o ID, o MySQL cria um NOVO registro automático (Duplicação)
                dadosParaConfirmar.delete('id'); 
                fecharModalConfirmacao();
                enviarDadosAoServidor(dadosParaConfirmar);
            }
        });
    }
    
    const btnNao = document.getElementById('btnNao');
    if (btnNao) btnNao.addEventListener('click', fecharModalConfirmacao);
});

// MOTOR DE LISTAGEM - CORRIGIDO
function carregarDados(novaBusca = false) {
    const tabela = document.getElementById("tabelaProdutos");
    const loading = document.getElementById("loading");

    if(loading) loading.style.display = "block";

    // Adicionamos um timestamp (&t=...) para forçar o navegador a não usar cache
    const url = `${API_URL}/carregar_produtos.php?t=${new Date().getTime()}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Erro na rede: " + res.status);
            return res.text();
        })
        .then(html => {
            if(tabela) tabela.innerHTML = html;
            if(loading) loading.style.display = "none";
        })
        .catch(err => {
            console.error("Erro ao carregar tabela:", err);
            if(loading) loading.innerText = "Erro ao conectar ao servidor.";
        });
}

// FUNÇÃO SALVAR/DUPLICAR
function salvarProduto(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Se não for edição, garantimos que não vai ID
    const btn = document.getElementById("btnSalvar");
    if (btn && btn.innerText !== "Atualizar Produto") {
        formData.delete('id');
    }

    formData.set('confirmado', 'nao');
    enviarDadosAoServidor(formData, form);
}

function enviarDadosAoServidor(formData, formElement = null) {
    const btn = document.getElementById("btnSalvar");
    if(btn) btn.disabled = true;

    fetch(`${API_URL}/adicionar.php`, {
        method: 'POST',
        body: formData
    })
    .then(async res => {
        const texto = await res.text();
        try {
            return JSON.parse(texto);
        } catch(e) {
            // Se der erro de formato, o erro real aparecerá aqui no F12
            console.error("Resposta bruta do PHP:", texto);
            throw new Error("Erro de formato no servidor.");
        }
    })
    .then(data => {
        if (data.status === "confirmacao") {
            dadosParaConfirmar = formData;
            abrirModalConfirmacao(data.mensagem);
        } else if (data.status === "sucesso") {
            mostrarAlerta(data.mensagem, "sucesso");
            if(formElement) formElement.reset();
            carregarDados(true); 
        } else {
            mostrarAlerta(data.mensagem, "erro");
        }
    })
    .catch(err => {
        mostrarAlerta("Falha na comunicação. Verifique o console (F12).", "erro");
    })
    .finally(() => {
        if(btn) btn.disabled = false;
    });
}

// Funções de interface (Modal/Alerta)
function abrirModalConfirmacao(msg) {
    document.getElementById('modalMensagem').innerText = msg;
    document.getElementById('modalConfirmacao').style.display = "flex";
}

function fecharModalConfirmacao() {
    document.getElementById('modalConfirmacao').style.display = "none";
}

function mostrarAlerta(msg, tipo) {
    const alerta = document.getElementById("mensagemFeedback");
    alerta.innerText = msg;
    alerta.className = `alerta ${tipo}`;
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 4000);
}