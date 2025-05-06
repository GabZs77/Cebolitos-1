
function abrirModal(titulo, descricao, tempoTotal) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    const caixa = document.createElement("div");
    caixa.style.background = "#1f1f1f";
    caixa.style.padding = "30px";
    caixa.style.borderRadius = "20px";
    caixa.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)";
    caixa.style.textAlign = "center";
    caixa.style.maxWidth = "90%";
    caixa.style.width = "400px";
    caixa.style.color = "white";
    caixa.style.fontFamily = "Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

    const tituloEl = document.createElement("h2");
    tituloEl.textContent = "Processando Atividades";
    tituloEl.style.marginBottom = "15px";

    const tempoEl = document.createElement("div");
    tempoEl.style.fontSize = "28px";
    tempoEl.style.fontWeight = "bold";
    tempoEl.style.margin = "10px 0";
    let segundos = 0;
    tempoEl.textContent = "00:00";

    const descricaoEl = document.createElement("p");
    descricaoEl.innerHTML = `
        Aguardando tempo para a atividade:<br>
        <strong>${titulo}</strong>. Tempo: <strong>${tempoTotal}</strong><br>
        Por favor, <strong>não feche esta página</strong>.
    `;
    descricaoEl.style.fontSize = "15px";
    descricaoEl.style.marginBottom = "15px";

    const barraContainer = document.createElement("div");
    barraContainer.style.width = "100%";
    barraContainer.style.height = "8px";
    barraContainer.style.background = "#333";
    barraContainer.style.borderRadius = "5px";
    barraContainer.style.overflow = "hidden";
    barraContainer.style.marginTop = "15px";

    const barra = document.createElement("div");
    barra.style.height = "100%";
    barra.style.width = "0%";
    barra.style.background = "linear-gradient(135deg, limegreen, green)";
    barra.style.transition = "width 1s linear";

    barraContainer.appendChild(barra);

    const progresso = document.createElement("p");
    progresso.textContent = "Processando 1 de 1 atividades";
    progresso.style.marginTop = "10px";
    progresso.style.fontSize = "14px";

    caixa.appendChild(tituloEl);
    caixa.appendChild(tempoEl);
    caixa.appendChild(descricaoEl);
    caixa.appendChild(barraContainer);
    caixa.appendChild(progresso);

    modal.appendChild(caixa);
    document.body.appendChild(modal);

    const timer = setInterval(() => {
        segundos++;
        const min = String(Math.floor(segundos / 60)).padStart(2, "0");
        const sec = String(segundos % 60).padStart(2, "0");
        tempoEl.textContent = `${min}:${sec}`;
        barra.style.width = `${(segundos / (parseInt(tempoTotal.split(":")[0]) * 60 + parseInt(tempoTotal.split(":")[1])) * 100).toFixed(2)}%`;
        if (barra.style.width === "100%") {
            clearInterval(timer);
            progresso.textContent = "Atividade concluída!";
        }
    }, 1000);
}

// Exemplo de chamada
abrirModal("Trocas de calor: entendendo a transferência de energia", "", "01:00");

