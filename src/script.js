
let MostrarSenha = document.getElementById("VerSenha");
let Senha = document.getElementById("senha");
let imagem = document.getElementById("OlhoVer");
let trava = false;

MostrarSenha.addEventListener("click", () => {
    if (Senha.type === "password") {
        Senha.type = "text";
        imagem.src = "visivel.png";
    } else {
        Senha.type = "password";
        imagem.src = "olho.png";
    }
});

function Atividade(Titulo, Atividade) {
    const div = document.createElement("div");
    div.className = "Notificacao";

    const h1 = document.createElement("h1");
    h1.textContent = Titulo;

    const p = document.createElement("p");
    p.textContent = Atividade;

    div.appendChild(h1);
    div.appendChild(p);

    const article = document.getElementById("TamanhoN");
    article.appendChild(div);

    div.style.animation = "Aparecer 1s ease";

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
    }, 2500);
}
document.getElementById('Enviar').addEventListener('submit', (e) => {
  e.preventDefault();
    if(trava) return;
    trava = true;
    const options = {
      TEMPO: 3,
      ENABLE_SUBMISSION: true,
    };
function sendRequest() {
  const teste = 'https://api.cebolitos.cloud/?type=token';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
    
  fetch(teste, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: document.getElementById('ra').value, password: document.getElementById('senha').value }),
  })
    .then(response => {
      if (!response.ok)
        throw new Error(`❌ Problema no servidor: ${response.status}`);
      return response.json();
    })
    .then(data => {
      Atividade('SALA-DO-FUTURO','Logado com sucesso!');
      fetchUserRooms(data.auth_token);
    }).catch(error => Atividade('SALA-DO-FUTURO','RA/SENHA Incorreto!'));
}

async function fetchUserRooms(token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch('https://api.cebolitos.cloud/?type=room', {
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
      const fetchPromises = data.rooms.map(room =>
        fetchTasks(token, room.name, room.topic,room.group_categories)
      );
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
    const response = await fetch('https://api.cebolitos.cloud/?type=tasks', {
      method: 'POST',
      headers,
      body: JSON.stringify({ token, room,groups }),
    });

    if (!response.ok) {
      throw new Error(`❌ Erro HTTP Status: ${response.status}`);
    }
    const data = await response.json();
    const tasksByTipo = {
      Normal: [],
      Expirada: [],
      Rascunho: [],
      RascunhoE: [],
    };
    data.results.forEach(result => {
      if (result && Array.isArray(result.data) && result.data.length > 0) {
        const tipo = result.label;
        const drafts = result.data.filter(item => item.answer_status === "draft");
        const nonDrafts = result.data.filter(item => item.answer_status !== "draft");
        
        if (tipo in tasksByTipo) {
          tasksByTipo[tipo] = tasksByTipo[tipo].concat(nonDrafts);
        
          if (drafts.length > 0) {
            tasksByTipo.Rascunho = (tasksByTipo.Rascunho || []).concat(drafts);
            tasksByTipo.RascunhoE = (tasksByTipo.RascunhoE || []).concat(drafts);
          }
        } else {
          tasksByTipo.Normal = tasksByTipo.Normal.concat(nonDrafts);
        
          if (drafts.length > 0) {
            tasksByTipo.Rascunho = (tasksByTipo.Rascunho || []).concat(drafts);
            tasksByTipo.RascunhoE = (tasksByTipo.RascunhoE || []).concat(drafts);
          }
        }
      }
    });

      const allTasks = [
      ...(tasksByTipo.Normal || []).map(t => ({ ...t, tipo: 'Normal' })),
      ...(tasksByTipo.Rascunho || []).map(t => ({ ...t, tipo: 'Rascunho' })),
      ...(tasksByTipo.Expirada || []).map(t => ({ ...t, tipo: 'Expirada' })),
      ...(tasksByTipo.RascunhoE || []).map(t => ({ ...t, tipo: 'RascunhoE' })),
    ];
    loadTasks(allTasks, token, room, 'TODOS');
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
}
async function loadTasks(data, token, room, tipo) {
  if (!Array.isArray(data) || data.length === 0) {
    Atividade('TAREFA-SP', '🚫 Nenhuma atividade disponível');
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
    if (config.ignorarRascunho &&  (task.tipo.toLowerCase() === 'rascunho' || task.tipo.toLowerCase() === 'rascunhoe')) return;
    if (config.ignorarExpiradas && task.tipo.toLowerCase() === 'expirada') return;
    if (config.ignorarPendente && task.tipo.toLowerCase() === 'normal') return;
    const taskId = task.id;
    const taskTitle = task.title;
    const type = task.tipo;
    const isRascunho = (type === 'Rascunho' || type === 'RascunhoE');
    const answerId = (isRascunho && task.answer_id != null) ? task.answer_id : undefined;

    const url = isRascunho
        ? `https://api.cebolitos.cloud/?type=previewTaskR`
        : `https://api.cebolitos.cloud/?type=previewTask`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const body = isRascunho && answerId != null
    ? JSON.stringify({ token, taskId, answerId })
    : JSON.stringify({ token, taskId });

    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const details = await response.json();
      const answersData = {};
        
      const PutaMEDIA = details.questions.some(q => q && q.type === 'media');
      if (PutaMEDIA) {
        Atividade('TAREFA-SP', `⏭️ Atividade "${task.title}" anulada por conter questão do tipo media`);
        return; 
      }
      details.questions.forEach(question => {
        if (!question || question.type === 'info') return;

        const questionId = question.id;
        let answer = {};

        if (question.options && typeof question.options === 'object') {
          const options = Object.values(question.options);
          const correctIndex = Math.floor(Math.random() * options.length);
          options.forEach((_, i) => {
            answer[i] = i === correctIndex;
          });
        }

        answersData[questionId] = {
          question_id: questionId,
          question_type: question.type,
          answer,
        };
      });

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
            iniciarModalGlobal(orderedTasks.length);
            submitAnswers(taskId, answersData, token, room, taskTitle, index + 1, orderedTasks.length, type, answerId);
            houveEnvio = true;
          } catch (submitErr) {
            console.error(`❌ Erro ao enviar respostas para a tarefa ${taskId}:`, submitErr);
          }
        }
      }
    } catch (error) {
    }
  }
    console.log(orderedTasks);
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
    let porra = {
        taskId: taskId,
        token: token,
        status: 'submitted',
        accessed_on: 'room',
        executed_on: room,
        answers: answersData,
      };
    let desgracaRascunho = {
        taskId: taskId,
        token: token,
        answerId: answerId,
        status: 'submitted',
        accessed_on: 'room',
        executed_on: room,
        answers: answersData,
      };
     const body = (tipo === 'Rascunho' || tipo === 'RascunhoE')
          ? desgracaRascunho
          : porra;
    
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      atualizarModalGlobal(taskTitle, options.TEMPO * 60, index, total);
      await delay(options.TEMPO * 60 * 1000); 
    
      try {
          const url = (tipo === 'Rascunho' || tipo === 'RascunhoE')
          ? `https://api.cebolitos.cloud/?type=submitR`
          : `https://api.cebolitos.cloud/?type=submit`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          });
        const response_json = await response.json();
        const new_task_id = response_json.id;
        fetchCorrectAnswers(taskId, new_task_id, token,taskTitle);
      } catch (error) {
  }
}

function fetchCorrectAnswers(taskId, answerId, token,taskTitle) {
  const url = `https://api.cebolitos.cloud/?type=fetchSubmit`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',    
  };

  fetch(url, { method: 'POST', headers,body:JSON.stringify({ token,taskId,answerId }) })
    .then(response => {
      if (!response.ok)
        throw new Error(
          `❌ Erro ao buscar respostas corretas! Status: ${response.status}`
        );
      return response.json();
    })
    .then(data => {
      putAnswer(data, taskId, answerId, token,taskTitle);
    })
    .catch(error =>
        console.log(error)
    );
}
function putAnswer(respostasAnteriores, taskId, answerId, token,taskTitle) {
  const url = `https://api.cebolitos.cloud/?type=putSubmit`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',  
  };
  const novasRespostasPayload = transformJson(respostasAnteriores);
  let bod = {
    taskId: taskId,
    answerId: answerId,
    token: token,
    ...novasRespostasPayload
  };
  fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(bod),
  })
    .then(response => {
      if (!response.ok)
        //throw new Error(
        //  `❌ Erro ao enviar respostas corrigidas! Status: ${response.status}`
        //);
      return response.json();
    })
    .then(data => {
        Atividade('TAREFA-SP','✅ Atividade Concluida - ' + taskTitle);
    })
    .catch(error => {
      Atividade('TAREFA-SP','❌ Erro ao corrigir a atividade - ' + taskTitle);
      //console.error('❌ Erro ao enviar respostas corrigidas:', error);
    });
}
function transformJson(jsonOriginal) {
    if (!jsonOriginal || !jsonOriginal.task || !jsonOriginal.task.questions) {
      throw new Error("Estrutura de dados inválida para transformação.");
    }

    let novoJson = {
      accessed_on: jsonOriginal.accessed_on,
      executed_on: jsonOriginal.executed_on,
      answers: {}
    };

    for (let questionId in jsonOriginal.answers) {
      let questionData = jsonOriginal.answers[questionId];
      let taskQuestion = jsonOriginal.task.questions.find(q => q.id === parseInt(questionId));

      if (!taskQuestion) {
        console.warn(`Questão com ID ${questionId} não encontrada!`);
        continue;
      }

      let answerPayload = {
        question_id: questionData.question_id,
        question_type: taskQuestion.type,
        answer: null
      };

      try {
        switch (taskQuestion.type) {
          case "order-sentences":
            if (taskQuestion.options && taskQuestion.options.sentences && Array.isArray(taskQuestion.options.sentences)) {
              answerPayload.answer = taskQuestion.options.sentences.map(sentence => sentence.value);
            }
            break;
          case "fill-words":
            if (taskQuestion.options && taskQuestion.options.phrase && Array.isArray(taskQuestion.options.phrase)) {
              answerPayload.answer = taskQuestion.options.phrase
                .map(item => item.value)
                .filter((_, index) => index % 2 !== 0);
            }
            break;
          case "text_ai":
            let cleanedAnswer = removeTags(taskQuestion.comment || '');
            answerPayload.answer = { "0": cleanedAnswer };
            break;
          case "fill-letters":
            if (taskQuestion.options && taskQuestion.options.answer !== undefined) {
              answerPayload.answer = taskQuestion.options.answer;
            }
            break;
          case "cloud":
            if (taskQuestion.options && taskQuestion.options.ids && Array.isArray(taskQuestion.options.ids)) {
              answerPayload.answer = taskQuestion.options.ids;
            }
            break;
          default:
            if (taskQuestion.options && typeof taskQuestion.options === 'object') {
              answerPayload.answer = Object.fromEntries(
                Object.keys(taskQuestion.options).map(optionId => {
                  const optionData = taskQuestion.options[optionId];
                  const answerValue = (optionData && optionData.answer !== undefined) ? optionData.answer : false;
                  return [optionId, answerValue];
                })
              );
            }
            break;
        }
        novoJson.answers[questionId] = answerPayload;
      } catch (err) {
        console.error(`Erro ao processar questão ID ${questionId}:`, err);
        trava = false;
        continue;
      }
    }
    return novoJson;
  }

function removeTags(htmlString) {
  return htmlString.replace(/<[^>]*>?/gm, '');
}

setTimeout(() => {
  trava = false;
}, 5000);

sendRequest();
});
