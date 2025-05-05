import fetch from 'node-fetch';

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let bodyData;
  try {
    bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const { url, method = 'GET', headers = {}, body = null } = bodyData;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" in request body' });
  }

  const timeout = 5000;

  const fakeBrowserHeaders = {
    "Origin": "https://edusp.ip.tv",
    "Referer": "https://edusp.ip.tv/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Connection": "keep-alive",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Content-Type": "application/json"
  };

  try {
    const response = await Promise.race([
      fetchWithRetry(url, {
        method: method.toUpperCase(),
        headers: {
          ...fakeBrowserHeaders,
          ...headers,
        },
        body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : JSON.stringify(body),
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ]);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    res.status(response.status).send(responseData);
  } catch (error) {
    console.error('Proxy error:', error.message);

    if (error.message.includes('429')) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    res.status(500).json({ error: 'Internal proxy error', details: error.message });
  }
}
