// api/proxy.js
const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    // Fazer a requisição para o site de destino
    const response = await axios.get(url);

    // Definir cabeçalhos CORS para permitir o acesso ao recurso
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Retornar a resposta do proxy para o cliente
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error fetching the requested URL:', error);
    res.status(500).json({ error: 'Error fetching the requested URL' });
  }
};
