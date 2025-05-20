
let MostrarSenha = document.getElementById("VerSenha");
let Senha = document.getElementById("senha");
const userAgent = navigator.userAgent;
let trava = false;

MostrarSenha.addEventListener("click", () => {
    Senha.type = Senha.type === "password" ? "text" : "password";
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

    setTimeout(() => {
        div.style.animation = "sumir 1.5s ease";
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
      TEMPO: 2, //Tempo atividade em Minutos
      ENABLE_SUBMISSION: true,
      LOGIN_URL: 'https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken',
      LOGIN_DATA: {
        id: document.getElementById('ra').value, 
        password: document.getElementById('senha').value,
      },
    };

function makeRequest(url, method = 'GET', headers = {}, body = null) {
  const options = {
    method,
    headers: {
      'User-Agent': navigator.userAgent,
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    options.body = body; // já está como string no sendRequestNew
  }

  return fetch(url, options)
    .then(res => {
      if (!res.ok) throw new Error(`❌ HTTP ${method} ${url} => ${res.status}`);
      return res.json();
    });
}
function loginRequest() {
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': navigator.userAgent,
    'Ocp-Apim-Subscription-Key': '2b03c1db3884488795f79c37c069381a',
  };

  makeRequest(options.LOGIN_URL, 'POST', headers, JSON.stringify(options.LOGIN_DATA))
    .then(data => {
      console.log('✅ Login bem-sucedido:', data);
      Atividade('SALA-DO-FUTURO','Logado com sucesso!');
      sendRequest(data.token);
    })
    .catch(error => {
      Atividade('SALA-DO-FUTURO','Nao foi possivel logar!')
      setTimeout(() => {
        trava = false;
      }, 2000);

    });
}

function sendRequest() {
  const teste = 'https://cebolitos.squareweb.app/api?type=token';
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
        throw new Error(`❌ Erro HTTP Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('✅ Informações do Aluno:', data);
      fetchUserRooms(data.auth_token);
    })
    .catch(error => console.error('❌ Erro na requisição:', error));
}

function fetchUserRooms(token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  fetch('https://cebolitos.vercel.app/api/server?type=room', {
    method: 'POST',
    headers,
    body: JSON.stringify({ 'apiKey': token }),
  })
    .then(response => {
      if (!response.ok)
        throw new Error(`❌ Erro HTTP Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
     console.log('✅ Salas do usuário:', data);
          if (data.rooms && data.rooms.length > 0) {
            Atividade('TAREFA-SP','Procurando atividades...');
            data.rooms.forEach(PORRA => {
              fetchTasks(token,PORRA.name, PORRA.topic);
            });
          } else {
            console.warn('⚠️ Nenhuma sala encontrada..');
          }
    })
    .catch(error => console.error('❌ Erro na requisição:', error));
}

function fetchTasks(token, room, name) {
const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  fetch('https://cebolitos.vercel.app/api/server?type=tasks', {
    method: 'POST',
    headers,
    body: JSON.stringify({ token,room }),
  })
    .then(response => {
      if (!response.ok)
        throw new Error(`❌ Erro HTTP Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
        data.results.forEach(result => {
              if (result) {
                console.log(
                  `✅ ${result.label} - Sala: ${name} - Atividades encontradas:`,
                  result.data
                );
              }
            });
        data.results.forEach(result => {
          if (result && result.data.length > 0) {
            loadTasks(result.data, token, room, result.label);
          }
        });
    })
    .catch(error => console.error('❌ Erro na requisição:', error));
}

// OBS ELE NAO FAZ AS RASCUNHO E NEM REDACAO EXPIRADA
function loadTasks(data, token, room, tipo) {
  if (tipo === 'Rascunho') {
    console.log(
      `⚠️ Ignorado: Tipo "${tipo}" - Nenhuma tarefa será processada.`
    );
    return;
  }
  const isRedacao = task =>
    task.tags.some(t => t.toLowerCase().includes('redacao')) ||
    task.title.toLowerCase().includes('redação');

  if (tipo === 'Expirada') {
    data = data.filter(task => !isRedacao(task));
    console.log(
      `⚠️ Ignorado: Tipo "${tipo}" - Nenhuma Redação será processada.`
    );
  }
  if (!data || data.length === 0) {
    Atividade('TAREFA-SP', '🚫 Nenhuma atividade disponível');
    return; 
  }
  const redacaoTasks = data.filter(task =>
    task.tags.some(t => t.toLowerCase().includes('redacao'))
  );

  const outrasTasks = data.filter(
    task => !task.tags.some(t => t.toLowerCase().includes('redacao'))
  );

  const orderedTasks = [...redacaoTasks, ...outrasTasks];
  let redacaoLogFeito = false;
  let tarefaLogFeito = false;
  let houveEnvio = false;
      const promises = orderedTasks.map((task, i) => {
        const taskId = task.id;
        const taskTitle = task.title;
    
        const url = `https://cebolitos.vercel.app/api/server?type=previewTask`;
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',      
        };
    
        return fetch(url, { method: 'POST', headers,body:JSON.stringify({ token,taskId }) })
          .then(response => {
            if (!response.ok)
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            return response.json();
          })
          .then(details => {
            const answersData = {};
    
            details.questions.forEach(question => {
              const questionId = question.id;
              let answer = {};
    
              if (question.type === 'info') return;
    
              if (question.type === 'media') {
                answer = {
                  status: 'error',
                  message: 'Type=media system require url',
                };
              } else if (question.options && typeof question.options === 'object') {
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
                log('REDACAO PAULISTA');
                redacaoLogFeito = true;
              }
              console.log(`✍️ Redação: ${taskTitle}`);
              console.log('⚠️ Auto-Redação', 'Manutenção');
            } else {
              Atividade('TAREFA-SP', `Fazendo atividade: ${taskTitle}`);
              console.log(`📝 Tarefa: ${taskTitle}`);
              console.log('⚠️ Respostas Fakes:', answersData);
              if (options.ENABLE_SUBMISSION) {
                submitAnswers(taskId, answersData, token, room,taskTitle, i + 1, orderedTasks.length);
              }
              houveEnvio = true;
            }
          })
          .catch(error =>
            console.error(`❌ Erro ao buscar detalhes da tarefa: ${taskId}:`, error)
          );
      });
      iniciarModalGlobal(orderedTasks.length);
}

function delay(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitAnswers(taskId, answersData, token, room, taskTitle, index, total) {
  let draft_body = {
    taskId: taskId,
    token: token,
    status: 'draft',//submitted
    accessed_on: 'room',
    executed_on: room,
    answers: answersData,
  };
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  console.log(`⏳ Aguardando ${options.TEMPO} minutos e realizando a tarefa ID: ${taskId}...`);
  atualizarModalGlobal(taskTitle, options.TEMPO * 60, index, total);
  await delay(options.TEMPO * 60 * 1000); // Aguarda o tempo definido

  try {
      
    const response = await fetch('https://cebolitos.vercel.app/api/server?type=submit', {
        method: 'POST',
        headers,
        body: JSON.stringify(draft_body),
      });
    const response_json = await response.json();
    const new_task_id = response_json.id;
    fetchCorrectAnswers(taskId, new_task_id, token,taskTitle);
  } catch (error) {
    console.error('❌ Erro ao enviar as respostas:', error);
  }
}

function fetchCorrectAnswers(taskId, answerId, token,taskTitle) {
  const url = `https://cebolitos.vercel.app/api/server?type=fetchSubmit`;
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
      console.log('📂 Respostas corretas recebidas:', data);
      putAnswer(data, taskId, answerId, token,taskTitle);
    })
    .catch(error =>
      console.error('❌ Erro ao buscar respostas corretas:', error)
    );
}
function putAnswer(respostasAnteriores, taskId, answerId, token,taskTitle) {
  const url = `https://cebolitos.vercel.app/api/server?type=putSubmit`;
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
        throw new Error(
          `❌ Erro ao enviar respostas corrigidas! Status: ${response.status}`
        );
      return response.json();
    })
    .then(data => {
        Atividade('TAREFA-SP','✅ Atividade Concluida - ' + taskTitle);
      console.log('✅ Respostas corrigidas enviadas com sucesso:', data);
    })
    .catch(error => {
      Atividade('TAREFA-SP','❌ Erro ao corrigir a atividade - ' + taskTitle);
      console.error('❌ Erro ao enviar respostas corrigidas:', error);
    });
}
function transformJson(jsonOriginal) {
    if (!jsonOriginal || !jsonOriginal.task || !jsonOriginal.task.questions) {
      throw new Error("Estrutura de dados inválida para transformação.");
    }

    let novoJson = {
      accessed_on: jsonOriginal.accessed_on,
      executed_on: jsonOriginal.executed_on,
      //duration: 60.00,
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
function log(str) {
console.log("===================================");
console.log(`★ ✦ CEBOLITOS ${str} ✦ ★`);
console.log("===================================");

}

setTimeout(() => {
  trava = false;
}, 5000);

// Iniciar o processo
sendRequest();
});
