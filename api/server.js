import fetch from 'node-fetch';

export default async function handler(req, res) {

  const { url, method = 'GET', headers = {}, body = null } = req.body;

  // Verifica se a URL foi fornecida
  if (!url) {
    return res.status(400).json({ error: 'URL de destino não fornecida' });
  }

  async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  try {
    // Adiciona 'Content-Type' como 'application/json' nos cabeçalhos
    headers['Content-Type'] = 'application/json';

    // Configura o timeout para 5 segundos
    const timeout = 5000; // 5 segundos

    // Faz a requisição com a URL fornecida e o timeout
    const response = await Promise.race([
      fetchWithRetry(url, {
        method: method.toUpperCase(),
        headers,
        body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
      }, 3, 1000),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Requisição excedeu o tempo limite')), timeout)
      ),
    ]);

    // Verifica o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    // Retorna a resposta com o status da requisição original
    res.status(response.status).send(responseData);
  } catch (error) {
    // Log de erro detalhado
    console.error('Erro no proxy:', error.message);
    
    // Retorna erro 500 com a mensagem de erro
    res.status(500).json({ error: 'Erro interno no proxy', details: error.message });
  }
}
