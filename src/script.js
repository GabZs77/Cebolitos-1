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
      TEMPO: 120, //Tempo atividade em SEGUNDOS
      ENABLE_SUBMISSION: true,
      LOGIN_URL: 'https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken',
      LOGIN_DATA: {
        user: document.getElementById('ra').value, 
        senha: document.getElementById('senha').value,
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
    options.body = JSON.stringify(body);
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

  makeRequest(options.LOGIN_URL, 'POST', headers, options.LOGIN_DATA)
    .then(data => {
      console.log('✅ Login bem-sucedido:', data);
      Atividade('SALA-DO-FUTURO','Logado com sucesso!');
      Atividade('Cebolitos','Atenção: o script não faz redações e atividades em rascunho!');
      Atividade('Cebolitos', 'O script vem como padrão o tempo de 150 Segundos para fazer as atividades!');
      sendRequestNew(data.token);
    })
    .catch(error => {
      Atividade('SALA-DO-FUTURO','Nao foi possivel logar!')
      setTimeout(() => {
        trava = false;
      }, 2000);

    });
}

function sendRequest(token) {
  fetch('https://cebolitos.onrender.com/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://edusp-api.ip.tv/registration/edusp/token',
    method: 'POST',
    headers: {
      'x-api-realm': 'edusp',
      'x-api-platform': 'webclient',
      'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': navigator.userAgent
    },
    body: {
      token:  { token }   // ← Substitua pelo token real
    }
  })
})
  .then(res => {
    if (!res.ok) throw new Error(`❌ HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log('✅ Informações do Aluno:', data);
    if (data.auth_token) {
      fetchUserRooms(data.auth_token);
    } else {
      console.warn('⚠️ auth_token ausente na resposta');
    }
  })
  .catch(err => {
    console.error('❌ Erro na requisição:', err);
    trava = false;
  });

}

function sendRequestNew(token) {
  const url = 'https://edusp-api.ip.tv/registration/edusp/token';
  const proxyUrl = '/api/server';

  const headers = {
    'Accept': 'application/json',
    'x-api-realm': 'edusp',
    'x-api-platform': 'webclient',
    'Host': 'edusp-api.ip.tv',
    'Content-Type': 'application/json'
  };

  makeRequest(proxyUrl, 'POST', { 'Content-Type': 'application/json' }, {
    url,
    method: 'POST',
    headers, // esses headers são enviados para a API real
    body: JSON.stringify({ token }) // o body real da requisição original
  })
    .then(data => {
      console.log('✅ Informações do Aluno:', data);
      fetchUserRooms(data.auth_token);
    })
    .catch(error => {
        Atividade('SALA-DO-FUTURO','Erro ao registrar');
      console.error('❌ Erro na requisição:', error);
        trava = false;
    });
}

function fetchUserRooms(token) {
  const originalUrl = 'https://edusp-api.ip.tv/room/user?list_all=true&with_cards=true';
  const proxyUrl = '/api/server';

  const headers = {
    'x-api-key': token
  };

  makeRequest(proxyUrl, 'POST', {
    'Content-Type': 'application/json'
  }, {
    url: originalUrl,
    method: 'GET',
    headers
  })
    .then(data => {
      console.log('✅ Salas do usuário:', data);
      if (data.rooms && data.rooms.length > 0) {
        const roomName = data.rooms[0].name;
        fetchTasks(token, roomName);
      } else {
        console.warn('⚠️ Nenhuma sala encontrada..');
      }
    })
    .catch(error => {
      console.error('❌ Erro na requisição de salas:', error);
      trava = false;
    });
}

function fetchTasks(token, room) {
  const proxyUrl = '/api/server';

  const urls = [
    {
      label: 'Rascunho',
      url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${room}&answer_statuses=draft&with_apply_moment=true`,
    },
    {
      label: 'Expirada',
      url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=true&filter_expired=false&with_answer=true&publication_target=${room}&answer_statuses=pending&with_apply_moment=true`,
    },
    {
      label: 'Normal',
      url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${room}&answer_statuses=pending&with_apply_moment=false`,
    },
  ];

  const requests = urls.map(({ label, url }) =>
    makeRequest(proxyUrl, 'POST', {
      'Content-Type': 'application/json'
    }, {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token
      }
    })
      .then(data => ({ label, data }))
      .catch(error => {
        console.error(`❌ Erro na ${label}:`, error);
        trava = false;
        return null;
      })
  );

  Promise.all(requests).then(results => {
    results.forEach(result => {
      if (result) {
        console.log(`✅ ${result.label} - Atividades encontradas:`, result.data);
      }
    });

    results.forEach(result => {
      if (result && result.data.length > 0) {
        loadTasks(result.data, token, room, result.label);
      }
    });
  });
}

// OBS ELE NAO FAZ AS RASCUNHO E NEM REDACAO EXPIRADA
function loadTasks(data, token, room, tipo) {
  if (tipo === 'Rascunho') {
    console.log(`⚠️ Ignorado: Tipo "${tipo}" - Nenhuma tarefa será processada.`);
    return;
  }

  const isRedacao = task =>
    task.tags.some(t => t.toLowerCase().includes('redacao')) ||
    task.title.toLowerCase().includes('redação');

  if (tipo === 'Expirada') {
    data = data.filter(task => !isRedacao(task));
    console.log(`⚠️ Ignorado: Tipo "${tipo}" - Nenhuma Redação será processada.`);
  }

  if (!data || data.length === 0) {
    Atividade('TAREFA-SP', '🚫 Nenhuma atividade disponível');
    return; // Parar execução se não houver tarefas
  }

  const redacaoTasks = data.filter(task =>
    task.tags.some(t => t.toLowerCase().includes("redacao"))
  );

  const outrasTasks = data.filter(task =>
    !task.tags.some(t => t.toLowerCase().includes("redacao"))
  );

  const orderedTasks = [...redacaoTasks, ...outrasTasks];
  let redacaoLogFeito = false;
  let houveEnvio = false;

  const promises = orderedTasks.map(task => {
    const taskId = task.id;
    const taskTitle = task.title;

    const proxyUrl = '/api/server';
    const apiUrl = `https://edusp-api.ip.tv/tms/task/${taskId}/apply?preview_mode=false`;

    const proxyPayload = {
      url: apiUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
        'x-api-key': token
      }
    };

    return fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proxyPayload)
    })
      .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
      })
      .then(details =>  {
        const answersData = {};

        details.questions.forEach(question => {
          const questionId = question.id;
          let answer = {};

          if (question.type === 'info') return;

          if (question.type === 'media') {
            answer = { status: 'error', message: 'Type=media system requires URL' };
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
            submitAnswers(taskId, answersData, token, room);
          }
          houveEnvio = true;
        }
      })
      .catch(error => {
        console.error(`❌ Erro ao buscar detalhes da tarefa: ${taskId}:`, error);
        trava = false;
      });
  });
}

function delay(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitAnswers(taskId, answersData, token, room) {
  const request = {
    status: "submitted",
    accessed_on: "room",
    executed_on: room,
    answers: answersData,
    // duration: "60.00"
  };

  const sendRequest = async (method, url, data) => {
    const proxyUrl = '/api/server'; // Seu proxy local

    const requestBody = {
      url, // URL de destino da API externa
      method, // Método HTTP (POST)
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
        'Accept': 'application/json',
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
      },
      body: data, // O corpo da requisição vai como objeto, não precisa serializar
    };

    try {
      const response = await makeRequest(
        proxyUrl,
        'POST',
        { 'Content-Type': 'application/json' },
        requestBody
      );
      return response;
    } catch (error) {
      throw new Error('Erro ao enviar requisição via proxy: ' + error.message);
    }
  };

  console.log(`⏳ Aguardando ${options.TEMPO} segundos e realizando a tarefa ID: ${taskId}...`);
  await delay(options.TEMPO * 1000); // Aguarda o tempo definido

  try {
    const response = await sendRequest("POST", `https://edusp-api.ip.tv/tms/task/${taskId}/answer`, request);

    if (!response || !response.id) {
      throw new Error('Resposta inválida da API');
    }

    const task_idNew = response.id;
    getCorrectAnswers(taskId, task_idNew, token);
  } catch (error) {
    console.error('❌ Erro ao enviar as respostas:', error);
    trava = false;
  }
}
function getCorrectAnswers(taskId, answerId, token) {
  const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}?with_task=true&with_genre=true&with_questions=true&with_assessed_skills=true`;
  
  const requestBody = {
    url, // URL de destino
    method: 'GET', // Método da requisição
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-realm': 'edusp',
      'x-api-platform': 'webclient',
      'x-api-key': token,
    },
  };

  const proxyUrl = '/api/server'; // URL do proxy

  // Envia a requisição via proxy
  makeRequest(proxyUrl, 'POST', {
    'Content-Type': 'application/json',
  }, requestBody)
    .then(response => {
      console.log('📂 Respostas corretas recebidas:', response);
      putAnswer(response, taskId, answerId, token);
    })
    .catch(error => {
      console.error('❌ Erro ao buscar respostas corretas:', error);
      trava = false;
    });
}
function putAnswer(respostasAnteriores, taskId, answerId, token) {
  const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}`;

  const requestBody = {
    url, // URL de destino
    method: 'PUT', // Método da requisição
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-realm': 'edusp',
      'x-api-platform': 'webclient',
      'x-api-key': token,
    },
    body: JSON.stringify(transformJson(respostasAnteriores)),
  };

  const proxyUrl = '/api/server'; // URL do proxy

  // Envia a requisição via proxy
  makeRequest(proxyUrl, 'POST', {
    'Content-Type': 'application/json',
  }, requestBody)
    .then(response => {
      console.log('✅ Respostas corrigidas enviadas com sucesso:', response);
    })
    .catch(error => {
      console.error('❌ Erro ao enviar respostas corrigidas:', error);
      trava = false;
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
loginRequest();
});
