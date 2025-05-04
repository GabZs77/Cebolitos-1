import fetch from 'node-fetch';
import cors from 'cors';
import express from 'express';

const app = express();

// Middleware para permitir CORS de qualquer origem
app.use(cors({
  origin: '*', // Permite todas as origens
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
    // Verifica se o body está correto (exemplo: string ou JSON)
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method.toUpperCase() === 'GET' ? undefined : JSON.stringify(body),
    });

    const responseData = await response.json();
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
