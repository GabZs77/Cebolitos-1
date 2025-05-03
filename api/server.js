const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
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
    const axiosOptions = {
      method: req.method,
      url,
      headers: forwardedHeaders,
      data: req.body, // Repassa o corpo (necessário para POST/PUT)
    };

    const response = await axios(axiosOptions);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-realm, x-api-platform');

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error fetching the requested URL:', error.message);
    res.status(500).json({ error: 'Erro ao fazer proxy da requisição', detalhe: error.message });
  }
};
