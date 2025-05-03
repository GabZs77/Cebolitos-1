export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Parâmetro ?url= obrigatório' });
  }

  try {
    const method = req.method;
    const headers = { ...req.headers };
    delete headers.host;

    const fetchOptions = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || 'text/plain';

    res.setHeader('Content-Type', contentType);
    res.status(response.status);

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer proxy', message: err.message });
  }
}
