const http = require('http');
const https = require('https');
const { URL } = require('url');

module.exports = async (req, res) => {
  const { url: targetUrl } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  const parsedUrl = new URL(targetUrl);
  const isHttps = parsedUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  // Lê o corpo da requisição original
  let rawBody = '';
  await new Promise(resolve => {
    req.on('data', chunk => (rawBody += chunk));
    req.on('end', resolve);
  });

  const proxyReqOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (isHttps ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.hostname, // <- Aqui forçamos o Host manualmente
      'Content-Length': Buffer.byteLength(rawBody),
    },
  };

  const proxyReq = client.request(proxyReqOptions, proxyRes => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-realm, x-api-platform'
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', err => {
    console.error('Erro no proxy:', err.message);
    res.status(500).json({ error: 'Erro ao fazer proxy da requisição', detalhe: err.message });
  });

  proxyReq.write(rawBody);
  proxyReq.end();
};
