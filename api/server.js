const http = require('http');
const https = require('https');
const { URL } = require('url');

module.exports = async (req, res) => {
  const { url: targetUrl } = req.query;

  if (!targetUrl) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).end(JSON.stringify({ error: 'Missing "url" query parameter' }));
  }

  // CORS pré-flight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-realm, x-api-platform');
    return res.status(200).end();
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
      host: parsedUrl.hostname, // Força Host correto
      'Content-Length': Buffer.byteLength(rawBody),
    },
  };

  const proxyReq = client.request(proxyReqOptions, proxyRes => {
    // Evita conflito de headers + adiciona CORS
    res.writeHead(proxyRes.statusCode, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-realm, x-api-platform',
      'Content-Type': proxyRes.headers['content-type'] || 'application/json',
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', err => {
    console.error('Erro no proxy:', err.message);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).end(JSON.stringify({ error: 'Erro ao fazer proxy da requisição', detalhe: err.message }));
  });

  proxyReq.write(rawBody);
  proxyReq.end();
};
