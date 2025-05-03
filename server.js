const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rota para proxy
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" parameter' });
  }

  try {
    // Fazer a requisição para o site de destino
    const response = await axios.get(targetUrl);

    // Enviar o conteúdo da resposta para o cliente
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching the requested URL' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
