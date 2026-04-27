const API_URL = "http://192.168.43.221/estoque_app/api";

document.addEventListener("DOMContentLoaded", () => {
    carregarEstatisticas();
});

async function carregarEstatisticas() {
    try {
        const res = await fetch(`${API_URL}/estatisticas.php`);
        const data = await res.json();

        if (data.status === "sucesso") {
            // Atualizar Cards
            document.getElementById("txtTotal").innerText = data.total_geral;
            document.getElementById("txtBalcao").innerText = data.total_balcao;
            document.getElementById("txtArmazem1").innerText = data.total_armazem1;
            document.getElementById("txtArmazem2").innerText = data.total_armazem2;

            renderizarGraficoStock(data);
            renderizarGraficoBuscas(data.mais_procurados);
        }
    } catch (err) {
        console.error("Erro:", err);
        const feedback = document.getElementById("mensagemFeedback");
        feedback.innerText = "⚠️ Erro ao conectar ao servidor.";
        feedback.style.display = "block";
    }
}

function renderizarGraficoStock(data) {
    const ctx = document.getElementById('graficoStock').getContext('2d');
    
    // Destruir gráfico anterior se existir (evita sobreposição)
    if(window.chartStock) window.chartStock.destroy();

    window.chartStock = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Balcão', 'Armazém 1', 'Armazém 2'],
            datasets: [{
                label: 'Referências',
                data: [data.total_balcao, data.total_armazem1, data.total_armazem2],
                backgroundColor: ['#36a2eb', '#4bc0c0', '#9966ff'], // Cores vibrantes
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#2c2c5a' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderizarGraficoBuscas(maisProcurados) {
    const canvas = document.getElementById('graficoBuscas');
    const msg = document.getElementById('msgSemDados');

    if (!maisProcurados || maisProcurados.length === 0) {
        canvas.style.display = 'none';
        msg.style.display = 'block';
        return;
    }

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: maisProcurados.map(p => p.referencia),
            datasets: [{
                data: maisProcurados.map(p => p.total_buscas),
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
        }
    });
}