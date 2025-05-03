const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "urls" query parameter' });
  }

  const excludedHeaders = ['host', 'connection', 'content-length'];

  // Filtrar e copiar headers do cliente
  const forwardedHeaders = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!excludedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders[key] = value;
    }
  }
  try {
    // Lê o corpo da requisição manualmente
    let body = '';
    await new Promise((resolve) => {
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', resolve);
    });

    const parsedBody = body ? JSON.parse(body) : undefined;

    const axiosOptions = {
      method: req.method,
      url,
      headers: forwardedHeaders,
      data: parsedBody,
    };

    const response = await axios(axiosOptions);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-api-realm, x-api-platform'
    );

    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao fazer proxy da requisição',
      detalhe: error.message,
      resposta: error.response?.data || null,
    });
};
