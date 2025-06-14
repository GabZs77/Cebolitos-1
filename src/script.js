
let MostrarSenha = document.getElementById("VerSenha");
let Senha = document.getElementById("senha");
let imagem = document.getElementById("OlhoVer");
let trava = false;
let correct = false;
let prova = false;
const urlG = 'https://cebolitos.ngrok.dev/';

function travar(asd) {
  if (asd === true) {
    if (!trava) {
      trava = true;
      console.log('[CEBOLITOS_CLOUD] - [ANTI-DUB]: TRAVA ATIVADA!');
      setTimeout(() => {
        trava = false;
        console.log('[CEBOLITOS_CLOUD] - [ANTI-DUB]: TRAVA DESATIVADA!')
      }, 8000);
    }
  } else if (typeof asd === 'boolean') {
    trava = asd;
    console.log(`[CEBOLITOS_CLOUD] - [ANTI-DUB]: TRAVA SETADA PARA ${asd.toString().toUpperCase()}`);
  }
}

function adicionarSemDuplicar(array, items) {
  const idsExistentes = new Set(array.map(t => t.id));
  for (const item of items) {
    if (!idsExistentes.has(item.id)) {
      array.push(item);
      idsExistentes.add(item.id);
    }
  }
}

MostrarSenha.addEventListener("click", () => {
    if (Senha.type === "password") {
        Senha.type = "text";
        imagem.src = "visivel.png";
    } else {
        Senha.type = "password";
        imagem.src = "olho.png";
    }
});

function Atividade(Titulo, Atividade, tempo = 2500) {
    const div = document.createElement("div");
    div.className = "Notificacao";

    const h1 = document.createElement("h1");
    h1.textContent = Titulo;

    const p = document.createElement("p");
    p.textContent = Atividade;

    const barraTempo = document.createElement("div");
    barraTempo.className = "barra-tempo";
  
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(barraTempo);

    const article = document.getElementById("TamanhoN");
    article.appendChild(div);

    div.style.animation = "AparecerBonito 1s ease";

    setTimeout(() => {
        div.style.animation = "sumir 1s ease";
        div.addEventListener("animationstart", () => {
          setTimeout(() => {
              const interval = setInterval(() => {
                  const currentScroll = article.scrollTop;
                  const targetScroll = article.scrollHeight;
                  const distance = targetScroll - currentScroll;
                  
                  article.scrollTop += distance * 0.4;
      
                  if (distance < 1) {
                      clearInterval(interval);
                  }
              }, 16);
          }, 200);
      });

        div.addEventListener("animationend", () => {
          div.remove();
        })
    }, tempo);
}
document.getElementById('Enviar').addEventListener('submit', (e) => {
  e.preventDefault();

  const botaoClicado = e.submitter;
   if (botaoClicado.id === 'Corrigir') {
    correct = true;
    prova = false;
  } else if (botaoClicado.id === 'Logar') {
    correct = false;
    prova = false;
  } else if (botaoClicado.id === 'prova') {
    correct = false;
    prova = true;
  }
  const options = {
      TEMPO: 3,
      ENABLE_SUBMISSION: true,
    };
function sendRequest() {
  if (!trava) {
    travar(true);
    const input = document.getElementById('ra');
    let raInput = input.value.trim().toUpperCase();
    raInput = raInput.replace(/SP$/i, '') + 'SP';        
    const teste = `${urlG}?type=token`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
      
    fetch(teste, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: raInput, password: document.getElementById('senha').value }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`❌ Problema no servidor: ${response.status}`);
          travar(false);
        }
        return response.json();
      })
      .then(data => {
        Atividade('SALA-DO-FUTURO','Logado com sucesso!');
        fetchUserRooms(data.auth_token,data.nick);
      }).catch(error => {
        Atividade('SALA-DO-FUTURO','RA/SENHA Incorreto!')
        travar(false);
    });
  }
}
async function fetchProva(token, room, name, groups, nick) {
  //Atividade('PROVA-PAULISTA', 'SISTEMA DESATIVADO ATÉ 09/06', 5000);
  //return;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(`${urlG}?type=provaPaulista`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token, room, groups, nick }),
    });

    if (!response.ok) {
      throw new Error(`❌ Erro HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    if (data && data.length > 0) {
      const config = await solicitarProva(data);
      
      for (let a = 0; a < config.tarefasSelecionadas.length; a++) {
          const tarefaCompleta = config.tarefasSelecionadas[a];
          const tarefa = {
            answers: tarefaCompleta.answer_answers,
            task: tarefaCompleta.task,
            executed_on: tarefaCompleta.answer_executed_on,
            accessed_on: tarefaCompleta.answer_accessed_on,
            id: tarefaCompleta.answer_id,
            task_id: tarefaCompleta.answer_task_id
          };
          const intervaloMensagem = setInterval(() => {
            Atividade('PROVA-PAULISTA', '⏳ Extraindo resposta da prova...' + tarefa.title);
          }, 2000);
        try {
          const response = await fetch(`${urlG}?type=extrairProva`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ tarefa }),
          });

          if (!response.ok) {
            throw new Error(`❌ Erro HTTP Status: ${response.status}`);
          }

          const extraidoA = await response.json();
          console.log(extraidoA);          
          if (extraidoA.status === 203) {
            Atividade('PROVA-PAULISTA', '⏳ PROVA EM PROCESSO AGUARDE!!!');
            return;
          }
          const respostaExtraida = extraidoA.json;
          const NotaTotal = Object.keys(respostaExtraida.answers).length;
          clearInterval(intervaloMensagem);
          Atividade('PROVA-PAULISTA',`✅ RESPOSTA DA PROVA EXTRAIDA COM SUCESSO!`);
          const enviandoMensagem = setInterval(() => {
            Atividade('PROVA-PAULISTA', `⏳ Enviando Prova Paulista... Nota SELECIONADA [${config.quantidade}/${NotaTotal}]`);
          }, 2000);
          try {
            const response = await fetch(`${urlG}?type=enviarProva`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ token, respostaExtraida, quantidade: config.quantidade, ids: tarefa.id, accessed_on1: tarefa.accessed_on, executed_ona: tarefa.executed_on}),
            });
   console.log(response);
            if (!response.ok) {
              throw new Error(`❌ Erro HTTP Status: ${response.status}`);
            }
  
            const result = await response.json();
            console.log(result);
            clearInterval(enviandoMensagem);
            Atividade('PROVA-PAULISTA', '✅ PROVA ENVIADA COM SUCESSO!');
          } catch (error) {
            clearInterval(enviandoMensagem);
            Atividade('PROVA-PAULISTA', '❌ ERRO: Nao foi possivel corrigir prova, motivos [Prova expirada/Tempo maximo atingido!]');
            console.error('❌ Erro na correção:', error);
          }
        } catch (error) {
          clearInterval(intervaloMensagem);
          Atividade('PROVA-PAULISTA', '❌ ERRO: Nao foi possivel corrigir prova, motivos [Prova expirada/Tempo maximo atingido!]');
          console.error('❌ Erro na correção:', error);
        }
      }
    } else {
      Atividade('TAREFA-SP', `🚫 SALA:[${name}] Nenhuma prova disponível para enviar!`);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

  
async function fetchTeste(token, room, name,groups,nick) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(`${urlG}?type=teste`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token,room,groups,nick }),
    });

    if (!response.ok) {
      throw new Error(`❌ Erro HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    
    const atividadesValidas = data.filter(item => {
      const expireAt = new Date(item.upado);
      const currentDate = new Date();
      const diff = currentDate - expireAt;
      return diff < 24 * 60 * 60 * 1000;
    });
    if (atividadesValidas != null && atividadesValidas.length > 0 && data != null && data.length > 0) {
      config = await solicitarTempoUsuario(atividadesValidas);
          
      for (let a = 0; a < config.tarefasSelecionadas.length; a++) {
          const tarefa = config.tarefasSelecionadas[a];
          const dadosFiltrados = {
            accessed_on: tarefa.accessed_on,
            executed_on: tarefa.executed_on,
            answers: tarefa.answers
          };
          Atividade('TAREFA-SP','Corrigindo atividade: ' + config.tarefasSelecionadas[a].title);
          setTimeout(()=>{
            corrigirAtividade(dadosFiltrados,tarefa.task_id,tarefa.answer_id,token,tarefa.title);
          },3000);
      }
    } else {
      Atividade('TAREFA-SP', `🚫 SALA:[${name}] Nenhuma atividade disponível para corrigir!`);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}
async function fetchUserRooms(token,nick) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(`${urlG}?type=room`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ apiKey: token }),
    });

    if (!response.ok) {
      throw new Error(`❌ Erro HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.rooms && data.rooms.length > 0) {
      Atividade('TAREFA-SP', 'Procurando atividades...');
    const fetchPromises = data.rooms.map(room => {
      if (correct) {
        //return fetchTeste(token, room.name, room.topic, room.group_categories,nick);
      } else if (prova) {
        return fetchProva(token,room.name,room.topic,room.group_categories,nick);
      } else {
        return fetchTasks(token, room.name, room.topic, room.group_categories);
      }
    });
      await Promise.all(fetchPromises);
    } else {
      console.warn('⚠️ Nenhuma sala encontrada.');
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

async function fetchTasks(token, room, name,groups) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  try {
    const response = await fetch(`${urlG}?type=tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token, room,groups }),
    });

    if (!response.ok) {
      throw new Error(`❌ Erro HTTP Status: ${response.status}`);
    }
    const data = await response.json();
    const tasksByTipo = {
      Pendente: [],
      Expirada: [],
      Rascunho: [],
      RascunhoE: [],
    };
    data.results.forEach(result => {
      if (result && Array.isArray(result.data) && result.data.length > 0) {
        const tipo = result.label;
    
        // 1. Agrupar por ID e aplicar prioridades
        const taskMap = new Map();
    
        for (const task of result.data) {
          const id = String(task.id);
          const taskStatus = (task.answer_status || '').toLowerCase().trim();
          const taskExpired = task.task_expired === true;
    
          if (!taskMap.has(id)) {
            taskMap.set(id, task);
          } else {
            const existing = taskMap.get(id);
            const existingStatus = (existing.answer_status || '').toLowerCase().trim();
            const existingExpired = existing.task_expired === true;
    
            if (taskStatus === 'draft' && existingStatus !== 'draft') {
              taskMap.set(id, task);
            } else if (taskStatus === 'draft' && existingStatus === 'draft') {
              if (taskExpired && !existingExpired) {
                taskMap.set(id, task);
              }
            } else if (existingStatus !== 'draft' && taskExpired && !existingExpired) {
              taskMap.set(id, task);
            }
          }
        }
    
        const tasks = Array.from(taskMap.values());
        const draftsNaoExpiradas = tasks.filter(t => (t.answer_status || '').toLowerCase().trim() === 'draft' && !t.task_expired);
        const draftsExpiradas = tasks.filter(t => (t.answer_status || '').toLowerCase().trim() === 'draft' && t.task_expired === true);
        const expiradasSemDraft = tasks.filter(t => (t.answer_status || '').toLowerCase().trim() !== 'draft' && t.task_expired === true);
        const naoDraftsNaoExpiradas = tasks.filter(t => (t.answer_status || '').toLowerCase().trim() !== 'draft' && !t.task_expired);

        if (tipo in tasksByTipo) {
          adicionarSemDuplicar(tasksByTipo[tipo], naoDraftsNaoExpiradas);
        } else {
          tasksByTipo.Pendente = tasksByTipo.Pendente || [];
          adicionarSemDuplicar(tasksByTipo.Pendente, naoDraftsNaoExpiradas);
        }
    
        tasksByTipo.Rascunho = tasksByTipo.Rascunho || [];
        adicionarSemDuplicar(tasksByTipo.Rascunho, draftsNaoExpiradas);
    
        tasksByTipo.RascunhoE = tasksByTipo.RascunhoE || [];
        adicionarSemDuplicar(tasksByTipo.RascunhoE, draftsExpiradas);
    
        tasksByTipo.Expirada = tasksByTipo.Expirada || [];
        adicionarSemDuplicar(tasksByTipo.Expirada, expiradasSemDraft);
      }
    });
    if (tasksByTipo.Pendente && tasksByTipo.Rascunho) {
      const idsNormais = new Set(tasksByTipo.Pendente.map(t => t.id));
      tasksByTipo.Rascunho = tasksByTipo.Rascunho.filter(t => !idsNormais.has(t.id));
    }
    const idIndex = {};
    
    for (const tipo in tasksByTipo) {
      for (const t of tasksByTipo[tipo]) {
        const id = String(t.id);
        if (!idIndex[id]) idIndex[id] = [];
        idIndex[id].push(tipo);
      }
    }
    
    for (const id in idIndex) {
      if (idIndex[id].length > 1) {
        console.warn(`❗ ID duplicado em múltiplos tipos: ${id} → [${idIndex[id].join(', ')}]`);
      }
    }

      const allTasks = [
      ...(tasksByTipo.Pendente || []).map(t => ({ ...t, tipo: 'Pendente' })),
      ...(tasksByTipo.Rascunho || []).map(t => ({ ...t, tipo: 'Rascunho' })),
      ...(tasksByTipo.Expirada || []).map(t => ({ ...t, tipo: 'Expirada' })),
      ...(tasksByTipo.RascunhoE || []).map(t => ({ ...t, tipo: 'RascunhoE' })),
    ];
    loadTasks(allTasks, token, room,name, 'TODOS');
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
}
async function loadTasks(data, token, room,ASD, tipo) {
  if (!Array.isArray(data) || data.length === 0) {
    Atividade('TAREFA-SP', `🚫 SALA:[${ASD}] Nenhuma atividade disponível`);
    return;
  }

  const isRedacao = task => {
    if (!task || !task.tags || !task.title) return false;
    return (
      task.tags.some(t => typeof t === 'string' && t.toLowerCase().includes('redacao')) ||
      task.title.toLowerCase().includes('redação')
    );
  };
  if (tipo === 'Expirada') {
    data = data.filter(task => !isRedacao(task));
  }

  const redacaoTasks = data.filter(isRedacao);
  const outrasTasks = data.filter(task => !isRedacao(task));
  const orderedTasks = [...redacaoTasks, ...outrasTasks];
  let config = null;
  let redacaoLogFeito = false;
  let houveEnvio = false;

  async function processTask(task, index) {
    const taskId = task.id;
    const taskTitle = task.title;
    const type = task.tipo;
    const isRascunho = (type === 'Rascunho' || type === 'RascunhoE');
    const answerId = (isRascunho && task.answer_id != null) ? task.answer_id : undefined;

    const url = `${urlG}?type=previewTask`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const body = JSON.stringify({ taskId, room, copy: 'cebolitos' });

    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const details = await response.json();
      const contemRedacao = isRedacao(task);

      if (contemRedacao) {
        if (!redacaoLogFeito) {
          redacaoLogFeito = true;
        }
        //console.log(`✍️ Redação: ${taskTitle}`);
        //console.log('⚠️ Auto-Redação em manutenção');
      } else {
        Atividade('TAREFA-SP', `Fazendo atividade: ${taskTitle}`);
        //console.log(`📝 Tarefa: ${taskTitle}`);
        //console.log('⚠️ Respostas Fakes:', answersData);

        if (options?.ENABLE_SUBMISSION) {
          try {
           // iniciarModalGlobal(orderedTasks.length);
            submitAnswers(taskId, details, token, room, taskTitle, index + 1, index + 1, type, answerId);
            houveEnvio = true;
          } catch (submitErr) {
            console.error(`❌ Erro ao enviar respostas para a tarefa ${taskId}:`, submitErr);
          }
        }
      }
    } catch (error) {
    }
  }
    config = await solicitarTempoUsuario(orderedTasks);
    options.TEMPO = config.tempo;
        
    for (let a = 0; a < config.tarefasSelecionadas.length; a++) {
        await processTask(config.tarefasSelecionadas[a], a);
    }
}


function delay(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitAnswers(taskId, answersData, token, room, taskTitle, index, total,tipo,answerId) {
    const isRascunho = tipo === 'Rascunho' || tipo === 'RascunhoE';
    const payload = {
      taskId,
      token,
      tipo,
      tempo: options.TEMPO,
      status: 'submitted',
      ...answersData,
      ...(isRascunho && { answerId }),
    };
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      //atualizarModalGlobal(taskTitle, options.TEMPO * 60, index, total);
      //await delay(options.TEMPO * 60 * 1000); 
    
      try {
          const url = `${urlG}?type=submit`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          });
        const response_json = await response.json();
        console.log(response_json);
        Atividade('TAREFA-SP',`✅ Atividade sendo processada no servidor [${taskTitle}] - TEMPO [${options.TEMPO}] minutos '`);
      } catch (error) {
  }
}


sendRequest();
});
