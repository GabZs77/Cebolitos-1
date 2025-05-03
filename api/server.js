import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, method = 'GET', headers = {}, body = null } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL de destino não fornecida' });
  }

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : JSON.stringify(body)
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    res.status(response.status).send(responseData);
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro interno no proxy' });
  }
}
