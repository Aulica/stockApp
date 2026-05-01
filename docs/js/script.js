// js/script.js

document.addEventListener("DOMContentLoaded", () => {

    const inputBusca = document.getElementById("referencia");
    const tabelaBody = document.getElementById("resultado");

    let timerBusca;

    // 🔒 Proteção: só executa se os elementos existirem
    if (!inputBusca || !tabelaBody) return;

    inputBusca.addEventListener("input", function () {
        const termo = this.value.trim();

        clearTimeout(timerBusca);

        if (termo.length < 2) {
            tabelaBody.innerHTML = "<tr><td colspan='4'>Digite pelo menos 2 caracteres...</td></tr>";
            return;
        }

        timerBusca = setTimeout(() => {
            executarBusca(termo);
            registrarLogBusca(termo);
        }, 300);
    });

    // 🔐 Controle de acesso visual (sem quebrar o JS)
    const tipo = localStorage.getItem('tipoUsuario');
    const btn = document.querySelector('.btn-link');

    if (btn && tipo !== 'admin') {
        btn.style.display = 'none';
    }
});

// 🔍 BUSCA PRINCIPAL
async function executarBusca(termo) {
    const tabelaBody = document.getElementById("resultado");

    tabelaBody.innerHTML = "<tr><td colspan='4'>Buscando...</td></tr>";

    try {
        const response = await fetch(`${CONFIG.API_URL}/buscar.php?referencia=${encodeURIComponent(termo)}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const texto = await response.text();

        let produtos;
        try {
            produtos = JSON.parse(texto);
        } catch {
            console.error("Resposta inválida:", texto);
            throw new Error("Erro no JSON");
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

// 📊 LOG (não quebra o sistema se falhar)
function registrarLogBusca(termo) {
    fetch(`${CONFIG.API_URL}/registrar_busca.php?termo=${encodeURIComponent(termo)}`)
        .catch(() => {});
}
