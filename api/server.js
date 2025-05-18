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
    throw new Error('Missing "type" query parameter');
  }
  if (!API_URLS[query.type]) {
    throw new Error('Invalid type');
  }
};

const buildFetchOptions = (req) => {
  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined,
    },
  };

  if (req.method !== 'GET') {
    options.body = JSON.stringify(req.body);
    options.headers['Content-Type'] = 'application/json';
  }

  return options;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    validateQueryParams(req.query);
    const { type } = req.query;
    const targetUrl = API_URLS[type];
    const options = buildFetchOptions(req);
    console.log("🔍 Enviando para:", targetUrl);
    console.log("🧾 Opções:", options);

    const response = await fetch(targetUrl, options);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
