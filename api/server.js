import fetch from 'node-fetch'; // Importando o fetch para o backend (Vercel)

// Função de proxy que recebe a requisição e a redireciona
export default async function handler(req, res) {
  const targetUrl = 'https://edusp-api.ip.tv/registration/edusp/token'; // A URL para a qual você deseja fazer o request

  try {
    // Fazendo a requisição para a API externa
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
      },
      body: JSON.stringify({ token: req.body.token }), // Envia o token recebido da requisição do frontend
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro na requisição à API externa' });
    }

    const data = await response.json(); // Converte a resposta da API para JSON
    return res.status(200).json(data); // Envia a resposta para o frontend
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}
