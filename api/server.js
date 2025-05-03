import fetch from 'node-fetch'; // Usando import

export default async function handler(req, res) {
  // Verifique se o método de requisição é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const targetUrl = 'https://edusp-api.ip.tv/registration/edusp/token'; // URL da API externa

  try {
    // Faça a requisição para a API externa com o cabeçalho Host
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
        'Host': 'edusp-api.ip.tv', // Cabeçalho Host
      },
      body: JSON.stringify({ token: req.body.token }) // Envia o token recebido
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro na requisição à API externa' });
    }

    const data = await response.json(); // Processa a resposta da API externa
    return res.status(200).json(data); // Envia a resposta de volta para o frontend
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
