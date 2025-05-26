let modalGlobal = null;
let tempoElGlobal = null;
let progressoElGlobal = null;
let descricaoElGlobal = null;
let atived = false;

function solicitarTempoUsuario(tasks) {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.75)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';

    // Caixa
    const caixa = document.createElement('div');
    caixa.style.background = '#202020';
    caixa.style.color = '#f5f5f5';
    caixa.style.padding = '30px 25px';
    caixa.style.borderRadius = '16px';
    caixa.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.4)';
    caixa.style.textAlign = 'center';
    caixa.style.fontFamily = 'Segoe UI, sans-serif';
    caixa.style.width = '90%';
    caixa.style.maxWidth = '400px';
    caixa.style.maxHeight = '80vh';
    caixa.style.overflowY = 'auto';

    // Título Atividades
    const atividadesTitulo = document.createElement('p');
    atividadesTitulo.textContent = 'Atividades';
    atividadesTitulo.style.fontWeight = 'bold';
    atividadesTitulo.style.marginBottom = '12px';
    atividadesTitulo.style.fontSize = '18px';
    caixa.appendChild(atividadesTitulo);

    // Container de checkboxes das tarefas
    const tarefasContainer = document.createElement('div');
    tarefasContainer.style.display = 'flex';
    tarefasContainer.style.flexDirection = 'column';
    tarefasContainer.style.alignItems = 'flex-start';
    tarefasContainer.style.paddingLeft = '20px';
    tarefasContainer.style.gap = '8px';
    tarefasContainer.style.marginBottom = '18px';

    // Criar checkbox para cada tarefa
    const checkboxElements = [];

    tasks.forEach((task, idx) => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontSize = '15px';
    label.style.cursor = 'pointer';
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
  
    const span = document.createElement('span');
    // Monta o texto "Title - TIPO"
    const title = task.title || task.nome || `Tarefa ${idx + 1}`;
    const tipo = task.tipo ? ` - ${task.tipo}` : '';
    span.textContent = title + tipo;
  
    label.appendChild(checkbox);
    label.appendChild(span);
    tarefasContainer.appendChild(label);
  
    checkboxElements.push({ checkbox, task });
  });

    caixa.appendChild(tarefasContainer);

    // Título para tempo
    const tituloTempo = document.createElement('p');
    tituloTempo.textContent = 'Defina o tempo por atividade (minutos)';
    tituloTempo.style.marginBottom = '12px';
    tituloTempo.style.fontSize = '16px';
    tituloTempo.style.fontWeight = 'bold';
    caixa.appendChild(tituloTempo);

    // Input tempo
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '1 a 5 minutos';
    input.style.padding = '10px 12px';
    input.style.width = '200px';
    input.style.border = '1px solid #444';
    input.style.borderRadius = '10px';
    input.style.marginBottom = '12px';
    input.style.fontSize = '16px';
    input.style.outline = 'none';
    input.style.background = '#2b2b2b';
    input.style.color = '#fff';
    input.style.boxShadow = 'inset 0 0 5px rgba(255, 255, 255, 0.05)';
    input.onfocus = () => (input.style.borderColor = '#4CAF50');
    input.onblur = () => (input.style.borderColor = '#444');
    caixa.appendChild(input);

    // Mensagem de erro
    const erro = document.createElement('p');
    erro.style.color = 'tomato';
    erro.style.fontSize = '14px';
    erro.style.margin = '6px 0';
    erro.style.display = 'none';
    caixa.appendChild(erro);

    // Botão confirmar
    const botao = document.createElement('button');
    botao.textContent = 'Confirmar';
    botao.style.marginTop = '10px';
    botao.style.padding = '10px 20px';
    botao.style.background = '#4CAF50';
    botao.style.border = 'none';
    botao.style.borderRadius = '8px';
    botao.style.color = 'white';
    botao.style.fontSize = '16px';
    botao.style.cursor = 'pointer';
    botao.style.transition = 'all 0.3s ease';
    botao.onmouseover = () => (botao.style.background = '#43a047');
    botao.onmouseout = () => (botao.style.background = '#4CAF50');

    botao.onclick = () => {
      const valor = parseInt(input.value);
      if (isNaN(valor) || valor < 1 || valor > 5) {
        erro.textContent = 'Digite um número válido de 1 a 5.';
        erro.style.display = 'block';
        return;
      }
      // Pega as tarefas selecionadas
      const tarefasSelecionadas = checkboxElements
        .filter(({ checkbox }) => checkbox.checked)
        .map(({ task }) => task);

      if (tarefasSelecionadas.length === 0) {
        erro.textContent = 'Selecione pelo menos uma tarefa.';
        erro.style.display = 'block';
        return;
      }

      document.body.removeChild(overlay);
      resolve({
        tempo: valor,
        tarefasSelecionadas
      });
    };

    caixa.appendChild(botao);
    overlay.appendChild(caixa);
    document.body.appendChild(overlay);
  });
}






function iniciarModalGlobal(total) {
  if (!atived) {
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
    atived = true;
  }
}


function atualizarModalGlobal(titulo, tempo, index, total) {
  if (!window.filaDeTitulos) window.filaDeTitulos = [];
  filaDeTitulos.push(titulo); 

  let tempoRestante = tempo;
  let tituloAtual = 0;
  const sucessoEl = document.getElementById("mensagem-sucesso");

  const totalAtividades = total;
  const indexAtividade = index;
  descricaoElGlobal.innerHTML = `Aguardando tempo para a atividade:<br><strong>TODAS AS ATIVIDADES</strong>`;
  progressoElGlobal.textContent = `Processando ${totalAtividades} atividades`;
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

  //atualizarTitulo();
  atualizarTempo();

  // Atualiza título a cada 3 segundos
  //const tituloInterval = setInterval(() => {
  //  if (tempoRestante <= 0) return;
  //  atualizarTitulo();
  //}, 3000);

  // Atualiza o cronômetro a cada segundo
  const tempoInterval = setInterval(() => {
    tempoRestante--;
    atualizarTempo();

    if (tempoRestante <= 0) {
      clearInterval(tempoInterval);
      sucessoEl.textContent = "✅ Atividade concluída com sucesso!";
      setTimeout(() => {
          const modal = document.getElementById("modal-global");
          filaDeTitulos = [];
          tituloAtual = 0;
          atived = false;
          if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
      }, 1200);
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
