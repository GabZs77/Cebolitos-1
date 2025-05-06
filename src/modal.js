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
  modalGlobal.style.flexDirection = "column";
  modalGlobal.style.justifyContent = "center";
  modalGlobal.style.alignItems = "center";
  modalGlobal.style.zIndex = "9999";
  modalGlobal.style.fontFamily = "Segoe UI, sans-serif";
  modalGlobal.id = "modal-global";

  let caixa = document.createElement("div");
  caixa.style.background = "#1f1f1f";
  caixa.style.padding = "30px";
  caixa.style.borderRadius = "20px";
  caixa.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)";
  caixa.style.textAlign = "center";
  caixa.style.maxWidth = "90%";
  caixa.style.width = "400px";
  caixa.style.color = "white";

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

  const avisoEl = document.createElement("p");
  avisoEl.textContent = "⚠️ OBS: Não feche esta página até que todas as atividades sejam concluídas.";
  avisoEl.style.marginTop = "25px";
  avisoEl.style.color = "orange";
  avisoEl.style.fontSize = "13px";

  const sucessoEl = document.createElement("div");
  sucessoEl.id = "mensagem-sucesso";
  sucessoEl.style.marginTop = "15px";
  sucessoEl.style.fontSize = "14px";
  sucessoEl.style.color = "#4CAF50";
  sucessoEl.textContent = "";

  caixa.appendChild(tituloEl);
  caixa.appendChild(loader);
  caixa.appendChild(tempoElGlobal);
  caixa.appendChild(descricaoElGlobal);
  caixa.appendChild(progressoElGlobal);
  caixa.appendChild(sucessoEl);
  caixa.appendChild(avisoEl);
  modalGlobal.appendChild(caixa);
  document.body.appendChild(modalGlobal);
}


function atualizarModalGlobal(titulo, tempo, index, total) {
  if (!window.filaDeTitulos) window.filaDeTitulos = [];
  filaDeTitulos.push(titulo); 

  let tempoRestante = tempo;
  let tituloAtual = 0;
  const sucessoEl = document.getElementById("mensagem-sucesso");

  const totalAtividades = total;
  const indexAtividade = index;

  const atualizarTitulo = () => {
    const titulo = filaDeTitulos[tituloAtual % filaDeTitulos.length];
    descricaoElGlobal.innerHTML = `Aguardando tempo para a atividade:<br><strong>${titulo}</strong>`;
    progressoElGlobal.textContent = `Processando ${totalAtividades} atividades`;
    tituloAtual++;
  };

  const atualizarTempo = () => {
    const min = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
    const sec = String(tempoRestante % 60).padStart(2, "0");
    tempoElGlobal.textContent = `${min}:${sec}`;
  };

  atualizarTitulo();
  atualizarTempo();

  // Atualiza título a cada 3 segundos
  const tituloInterval = setInterval(() => {
    if (tempoRestante <= 0) return;
    atualizarTitulo();
  }, 3000);

  // Atualiza o cronômetro a cada segundo
  const tempoInterval = setInterval(() => {
    tempoRestante--;
    atualizarTempo();

    if (tempoRestante <= 0) {
      clearInterval(tempoInterval);
      clearInterval(tituloInterval);
      sucessoEl.textContent = "✅ Atividade concluída com sucesso!";
      setTimeout(() => {
          const modal = document.getElementById("modal-global");
          filaDeTitulos = [];
          tituloAtual = 0;
          if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
      }, 3000);
    }
  }, 1000);
}


const estilo = document.createElement("style");
estilo.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(estilo);
