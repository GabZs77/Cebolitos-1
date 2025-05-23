import express from 'express';
import bodyParser from 'body-parser';
import handler from './server.js'; // seu arquivo original renomeado de .ts/.js para handler.js

const app = express();
app.use(bodyParser.json());

app.all('*', (req, res) => handler(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
