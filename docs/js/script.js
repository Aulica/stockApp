const API_URL = "http://a-stock.rf.gd/api"; // URL Base

const inputBusca = document.getElementById("referencia");
const tabelaBody = document.getElementById("resultado");

let timerBusca;

// 🔒 Proteção: só executa se o input existir
if (inputBusca && tabelaBody) {

    inputBusca.addEventListener("input", function () {
        const termo = this.value.trim();

        clearTimeout(timerBusca);

        if (termo.length < 2) {
            tabelaBody.innerHTML = "<tr><td colspan='4'>Digite pelo menos 2 caracteres...</td></tr>";
            return;
        }

        // Debounce
        timerBusca = setTimeout(() => {
            executarBusca(termo);
            registrarLogBusca(termo);
        }, 300);
    });

}

// 🔍 BUSCA PRINCIPAL
async function executarBusca(termo) {
    tabelaBody.innerHTML = "<tr><td colspan='4'>Buscando...</td></tr>";

    try {
        const response = await fetch(`${API_URL}/buscar.php?referencia=${encodeURIComponent(termo)}`);

        // 🔒 Verifica erro HTTP (404, 500, etc)
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const texto = await response.text();

        // 🔒 Evita crash se PHP retornar erro em HTML
        let produtos;
        try {
            produtos = JSON.parse(texto);
        } catch (e) {
            console.error("Resposta inválida do servidor:", texto);
            throw new Error("Erro no formato JSON");
        }

        if (Array.isArray(produtos) && produtos.length > 0) {
            const html = produtos.map(p => `
                <tr>
                    <td>${p.referencia || '-'}</td>
                    <td>${p.balcao || '-'}</td>
                    <td>${p.armazem1 || '-'}</td>
                    <td>${p.armazem2 || '-'}</td>
                </tr>
            `).join('');

            tabelaBody.innerHTML = html;

        } else {
            tabelaBody.innerHTML = "<tr><td colspan='4'>Nenhuma referência encontrada.</td></tr>";
        }

    } catch (error) {
        console.error("Erro na busca:", error);

        tabelaBody.innerHTML = `
            <tr>
                <td colspan='4' style='color:red'>
                    Erro ao conectar ao servidor.
                </td>
            </tr>
        `;
    }
}

// 📊 LOG DE BUSCA (não bloqueia a app)
function registrarLogBusca(termo) {
    fetch(`${API_URL}/registrar_busca.php?termo=${encodeURIComponent(termo)}`)
        .catch(err => console.warn("Falha ao registrar log:", err));
}

const tipo = localStorage.getItem('tipoUsuario');
if (tipo !== 'admin') {
    document.querySelector('.btn-link').style.display = 'none';
}
