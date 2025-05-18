const API_URLS = {
  login: 'https://saladofuturo.com/api/login',
  token: 'https://edusp-api.ip.tv/registration/edusp/token',
};

export const config = {
  api: {
    bodyParser: true,
  },
};

const validateQueryParams = (query) => {
  if (!query.type) {
    throw new Error('NÃO FOI ESSE CARAI');
  }
  if (!API_URLS[query.type]) {
    throw new Error('CARAI INVALIDO');
  }
};

const buildFetchOptions = (req,type) => {
  const bodyData = { ...req.body };
  const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-realm': 'edusp',
      'Host': 'edusp-api.ip.tv',
      'x-api-platform': 'webclient',
    };
    if (type !== 'token' && bodyData.apiKey) {
      headers['x-api-key'] = bodyData.apiKey;
      delete bodyData.apiKey;
    }
    const options = {
      method: req.method,
      headers,
    };
    if (req.method !== 'GET') {
      options.body = JSON.stringify(req.body);
      options.headers['Content-Type'] = 'application/json';
    }
  
    return options;
};

const fetchWithRetry = async (url, options, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        console.warn(`Tentativa ${attempt} falhou - Status: ${response.status}`);
        if (attempt === maxAttempts) throw new Error(`Erro HTTP ${response.status}`);
        continue;
      }

      return response;
    } catch (err) {
      console.warn(`Tentativa ${attempt} deu erro:`, err.message);
      if (attempt === maxAttempts) throw err;
    }
  }
};

const ALLOWED_ORIGIN = 'https://cebolitos.vercel.app';

const validateOrigin = (req) => {
  const origin = req.headers.origin || req.headers.referer || '';
  if (!origin.startsWith(ALLOWED_ORIGIN)) {
    throw new Error('Origem não autorizada');
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    validateOrigin(req);
    validateQueryParams(req.query);
    const { type } = req.query;
    if (type === 'tasks') {
      const { room, token } = req.body;
      if (!room || !token) {
        return res.status(400).json({ error: 'Faltando room ou token no body' });
      }

      const urls = [
        {
          label: 'Rascunho',
          url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${encodeURIComponent(room)}&answer_statuses=draft&with_apply_moment=true`,
        },
        {
          label: 'Expirada',
          url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=true&filter_expired=false&with_answer=true&publication_target=${encodeURIComponent(room)}&answer_statuses=pending&with_apply_moment=true`,
        },
        {
          label: 'Normal',
          url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${encodeURIComponent(room)}&answer_statuses=pending&with_apply_moment=false`,
        },
      ];

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': token,
          Accept: 'application/json',
        },
      };

      const requests = urls.map(({ label, url }) =>
        fetchWithRetry(url, options)
          .then((response) => {
            if (!response.ok)
              throw new Error(`❌ Erro na ${label}: ${response.statusText}`);
            return response.json();
          })
          .then((data) => ({ label, data }))
          .catch((error) => {
            console.error(`❌ Erro na ${label}:`, error.message);
            return { label, error: error.message };
          })
      );

      const results = await Promise.all(requests);

      return res.status(200).json({ results });
    }
    if (API_URLS[type]) {
      const targetUrl = API_URLS[type];
      const options = buildFetchOptions(req,type);
      console.log("Enviando essa porra:", targetUrl);
      console.log("opcoes desse carai", options);
  
      const response = await fetchWithRetry(targetUrl, options);
      const data = await response.json();
  
      return res.status(response.status).json(data);
    }
    throw new Error('Alguma porra acontenceu');
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
