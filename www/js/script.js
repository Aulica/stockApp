const API_URL = "http://192.168.43.221/estoque_app/api"; // URL Base
const inputBusca = document.getElementById("referencia");
const tabelaBody = document.getElementById("resultado");

let timerBusca;

inputBusca.addEventListener("input", function() {
    const termo = this.value.trim();

    clearTimeout(timerBusca);

    if (termo.length < 2) {
        tabelaBody.innerHTML = "<tr><td colspan='4'>Digite pelo menos 2 caracteres...</td></tr>";
        return;
    }

    // Debounce de 300ms: busca rápida após parar de digitar
    timerBusca = setTimeout(() => {
        executarBusca(termo);
        registrarLogBusca(termo);
    }, 300); 
});

async function executarBusca(termo) {
    tabelaBody.innerHTML = "<tr><td colspan='4'>Buscando...</td></tr>";

    try {
        const response = await fetch(`${API_URL}/buscar.php?referencia=${encodeURIComponent(termo)}`);
        const produtos = await response.json();

        if (produtos.length > 0) {
            // Construção de string única é mais rápido que innerHTML repetitivo
            let html = produtos.map(p => `
                <tr>
                    <td>${p.referencia}</td>
                    <td>${p.balcao}</td>
                    <td>${p.armazem1}</td>
                    <td>${p.armazem2}</td>
                </tr>
            `).join('');
            tabelaBody.innerHTML = html;
        } else {
            tabelaBody.innerHTML = "<tr><td colspan='4'>Nenhuma referência encontrada.</td></tr>";
        }
    } catch (error) {
        console.error("Erro na busca:", error);
        tabelaBody.innerHTML = "<tr><td colspan='4' style='color:red'>Erro ao conectar ao servidor.</td></tr>";
    }
}

function registrarLogBusca(termo) {
    fetch(`${API_URL}/registrar_busca.php?termo=${encodeURIComponent(termo)}`).catch(() => {});
}