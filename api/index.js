import fetch from 'node-fetch';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url, method = 'POST', headers = {}, body = null } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL de destino não fornecida' });
  }

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method.toUpperCase() === 'GET' ? undefined : JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();

    if (!contentType.includes('application/json')) {
      return res.status(response.status).json({
        error: 'Resposta não é JSON',
        bodyPreview: responseText.substring(0, 300),
        contentType
      });
    }

    const responseData = JSON.parse(responseText);
    res.status(response.status).json(responseData);

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    res.status(500).json({
      error: 'Erro interno no servidor',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
