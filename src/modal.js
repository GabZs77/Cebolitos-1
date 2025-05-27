
let tempoRestanteGlobal = 0; // Variável global para o tempo restante
let tempoInterval; // Intervalo de tempo global
let filaDeTitulos = []; // Fila de títulos das tarefas
let tempoPorAtividade = {}; // Tempo restante por atividade
let atived = false;
function solicitarTempoUsuario(tasks) {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out'
    });
    setTimeout(() => (overlay.style.opacity = 1), 10);

    // Caixa (modal)
    const caixa = document.createElement('div');
    Object.assign(caixa.style, {
      background: 'rgba(40, 40, 40, 0.95)',
      color: '#f0f0f0',
      padding: '35px 30px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      textAlign: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      width: '90%',
      maxWidth: '460px',
      maxHeight: '80vh',
      overflow: 'hidden', // Sem scroll na modal
      transform: 'scale(0.8)',
      transition: 'transform 0.4s ease'
    });
    setTimeout(() => (caixa.style.transform = 'scale(1)'), 100);

    // Título
    const titulo = document.createElement('h2');
    titulo.textContent = '📝 Atividades';
    titulo.style.marginBottom = '18px';
    titulo.style.fontSize = '22px';
    titulo.style.color = '#ffffff';
    caixa.appendChild(titulo);

    // Div de conteúdo das atividades (com scroll, se necessário)
    const atividadesContainer = document.createElement('div');
    Object.assign(atividadesContainer.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: '10px',
      gap: '10px',
      marginBottom: '24px',
      maxHeight: '300px', // Limitar altura da lista de atividades
      overflowY: 'auto', // Permitindo o scroll dentro dessa área específica
    });

    const checkboxElements = [];

    tasks.forEach((task, idx) => {
      const label = document.createElement('label');
      Object.assign(label.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '15.5px',
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: '8px',
        transition: 'background 0.2s',
        width: '100%'
      });

      label.onmouseenter = () => label.style.background = 'rgba(255,255,255,0.05)';
      label.onmouseleave = () => label.style.background = 'transparent';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.transform = 'scale(1.2)';
      checkbox.style.cursor = 'pointer';

      const span = document.createElement('span');
      const title = task.title || task.nome || `Tarefa ${idx + 1}`;
      const tipo = task.tipo ? ` - ${task.tipo}` : '';
      const emoji = '🔹'; // Placeholder emoji
      span.textContent = `${emoji} ${title}${tipo}`;

      label.appendChild(checkbox);
      label.appendChild(span);
      atividadesContainer.appendChild(label);

      checkboxElements.push({ checkbox, task });
    });

    caixa.appendChild(atividadesContainer); // Adiciona a lista de atividades dentro da caixa

    // Título do tempo
    const tituloTempo = document.createElement('p');
    tituloTempo.textContent = '⏱️ Tempo por atividade (minutos)';
    Object.assign(tituloTempo.style, {
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '12px',
      color: '#dddddd'
    });
    caixa.appendChild(tituloTempo);

    // Controles de incremento de tempo
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.justifyContent = 'center';
    inputContainer.style.gap = '10px';
    caixa.appendChild(inputContainer);

    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-';
    Object.assign(decrementButton.style, {
      padding: '8px 12px',
      fontSize: '18px',
      background: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s ease'
    });
    decrementButton.onmouseover = () => decrementButton.style.background = '#43a047';
    decrementButton.onmouseout = () => decrementButton.style.background = '#4CAF50';

    const inputTempo = document.createElement('input');
    inputTempo.value = 1; // Valor inicial 1
    inputTempo.min = 1;
    inputTempo.max = 6;
    inputTempo.style.width = '80px';
    inputTempo.style.padding = '8px';
    inputTempo.style.fontSize = '16px';
    inputTempo.style.textAlign = 'center';
    inputTempo.style.border = '1px solid #555';
    inputTempo.style.borderRadius = '10px';
    inputTempo.style.background = '#333';
    inputTempo.style.color = '#fff';

    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    Object.assign(incrementButton.style, {
      padding: '8px 12px',
      fontSize: '18px',
      background: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s ease'
    });
    incrementButton.onmouseover = () => incrementButton.style.background = '#43a047';
    incrementButton.onmouseout = () => incrementButton.style.background = '#4CAF50';

    incrementButton.onclick = () => {
      if (parseInt(inputTempo.value) < 6) {
        inputTempo.value = parseInt(inputTempo.value) + 1;
      }
    };

    decrementButton.onclick = () => {
      if (parseInt(inputTempo.value) > 1) {
        inputTempo.value = parseInt(inputTempo.value) - 1;
      }
    };

    inputContainer.appendChild(decrementButton);
    inputContainer.appendChild(inputTempo);
    inputContainer.appendChild(incrementButton);

    // Mensagem de erro
    const erro = document.createElement('p');
    erro.style.color = 'tomato';
    erro.style.fontSize = '14px';
    erro.style.margin = '6px 0';
    erro.style.display = 'none';
    caixa.appendChild(erro);

    // Botão de confirmar
    const botao = document.createElement('button');
    botao.textContent = '✅ Confirmar';
    Object.assign(botao.style, {
      marginTop: '15px',
      padding: '12px 28px',
      background: '#4CAF50',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease-in-out'
    });
    botao.onmouseover = () => botao.style.background = '#43a047';
    botao.onmousedown = () => botao.style.transform = 'scale(0.96)';
    botao.onmouseup = () => botao.style.transform = 'scale(1)';
    botao.onmouseout = () => {
      botao.style.background = '#4CAF50';
      botao.style.transform = 'scale(1)';
    };

    botao.onclick = () => {
      const valor = parseInt(inputTempo.value);
      if (isNaN(valor) || valor < 1 || valor > 6) {
        erro.textContent = 'Digite um número válido de 1 a 6.';
        erro.style.display = 'block';
        return;
      }

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



function solicitarTempoUsuario2(tasks) {
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
    checkbox.checked = false;
  
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

   const tituloTempo = document.createElement('p');
    tituloTempo.textContent = 'Defina o tempo por atividade (minutos)';
    tituloTempo.style.marginBottom = '12px';
    tituloTempo.style.fontSize = '16px';
    tituloTempo.style.fontWeight = 'bold';
    caixa.appendChild(tituloTempo);

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

    const erro = document.createElement('p');
    erro.style.color = 'tomato';
    erro.style.fontSize = '14px';
    erro.style.margin = '6px 0';
    erro.style.display = 'none';
    caixa.appendChild(erro);

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


// Função que inicializa o modal
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

// Função que atualiza o modal global
function atualizarModalGlobal(titulo, tempo, index, total) {
  filaDeTitulos.push(titulo);

  // Gerencia o tempo restante
  tempoRestanteGlobal = tempo; 
  let tempoRestanteAtual = tempoRestanteGlobal;
  let tituloAtual = 0;
  const sucessoEl = document.getElementById("mensagem-sucesso");

  const totalAtividades = total;
  const indexAtividade = index;
  descricaoElGlobal.innerHTML = `Aguardando tempo para a atividade:<br><strong>TODAS AS ATIVIDADES</strong>`;
  progressoElGlobal.textContent = `Processando ${totalAtividades} atividades`;

  // Atualiza o tempo a cada segundo
  if (tempoInterval) clearInterval(tempoInterval); // Limpa o intervalo anterior

  tempoInterval = setInterval(() => {
    tempoRestanteAtual--;
    const min = String(Math.floor(tempoRestanteAtual / 60)).padStart(2, "0");
    const sec = String(tempoRestanteAtual % 60).padStart(2, "0");
    tempoElGlobal.textContent = `${min}:${sec}`;
    
    if (tempoRestanteAtual <= 0) {
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

// Adicionando animação
const estilo = document.createElement("style");
estilo.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(estilo);
