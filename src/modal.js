let modalGlobal = null;
let tempoElGlobal = null;
let progressoElGlobal = null;
let descricaoElGlobal = null;

function iniciarModalGlobal(total) {
  modalGlobal = document.createElement("div");
  modalGlobal.style.position = "fixed";
  modalGlobal.style.top = "0";
  modalGlobal.style.left = "0";
  modalGlobal.style.width = "100vw";
  modalGlobal.style.height = "100vh";
  modalGlobal.style.background = "rgba(0,0,0,0.7)";
  modalGlobal.style.display = "flex";
  modalGlobal.style.justifyContent = "center";
  modalGlobal.style.alignItems = "center";
  modalGlobal.style.zIndex = "9999";

  let caixa = document.createElement("div");
  caixa.style.background = "#1f1f1f";
  caixa.style.padding = "30px";
  caixa.style.borderRadius = "20px";
  caixa.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)";
  caixa.style.textAlign = "center";
  caixa.style.maxWidth = "90%";
  caixa.style.width = "400px";
  caixa.style.color = "white";
  caixa.style.fontFamily = "Segoe UI, sans-serif";

  let tituloEl = document.createElement("h2");
  tituloEl.textContent = "Processando Atividades";
  tituloEl.style.marginBottom = "15px";

  let loader = document.createElement("div");
  loader.style.width = "40px";
  loader.style.height = "40px";
  loader.style.border = "4px solid rgba(255,255,255,0.2)";
  loader.style.borderTop = "4px solid white";
  loader.style.borderRadius = "50%";
  loader.style.margin = "10px auto";
  loader.style.animation = "spin 1s linear infinite";

  tempoElGlobal = document.createElement("div");
  tempoElGlobal.style.fontSize = "28px";
  tempoElGlobal.style.fontWeight = "bold";
  tempoElGlobal.style.margin = "10px 0";

  descricaoElGlobal = document.createElement("p");
  descricaoElGlobal.style.fontSize = "15px";
  descricaoElGlobal.style.marginBottom = "15px";

  progressoElGlobal = document.createElement("p");
  progressoElGlobal.style.marginTop = "10px";
  progressoElGlobal.style.fontSize = "14px";

  caixa.appendChild(tituloEl);
  caixa.appendChild(loader);
  caixa.appendChild(tempoElGlobal);
  caixa.appendChild(descricaoElGlobal);
  caixa.appendChild(progressoElGlobal);
  modalGlobal.appendChild(caixa);
  document.body.appendChild(modalGlobal);
}

function atualizarModalGlobal(titulo, tempo, index, total) {
  descricaoElGlobal.innerHTML = `
    Aguardando tempo para a atividade:<br>
    <strong>${titulo}</strong>
  `;
  progressoElGlobal.textContent = `Processando ${index} de ${total} atividades`;

  let tempoRestante = tempo;
  function atualizarTempo() {
    const min = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
    const sec = String(tempoRestante % 60).padStart(2, "0");
    tempoElGlobal.textContent = `${min}:${sec}`;
  }

  atualizarTempo();
  const timer = setInterval(() => {
    tempoRestante--;
    atualizarTempo();
    if (tempoRestante <= 0) clearInterval(timer);
  }, 1000);
}

function fecharModalGlobal() {
  if (modalGlobal) document.body.removeChild(modalGlobal);
}
const estilo = document.createElement("style");
estilo.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(estilo);
