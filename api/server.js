export const config = {
  api: {
    bodyParser: true, // Aceita JSON por padrão (isso já é true por padrão)
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Missing "type" query parameter' });
  }

  try {
    let targetUrl = '';
    let options = {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // Remover headers que causam erro
      },
    };

    // Apenas incluir body se não for GET
    if (req.method !== 'GET') {
      options.body = JSON.stringify(req.body);
      options.headers['Content-Type'] = 'application/json';
    }

    if (type === 'login') {
      targetUrl = 'https://exemplo.com/api/login';
    } else if (type === 'token') {
      targetUrl = 'https://exemplo.com/api/token';
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const response = await fetch(targetUrl, options);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer fetch', details: err.message });
  }
}
