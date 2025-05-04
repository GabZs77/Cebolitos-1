import express from 'express';
import cors from 'cors'; // <-- adicione isso
import handler from './server.js';

const app = express();

// Libera CORS para todas as origens
app.use(cors()); // <-- ESSENCIAL para lidar com preflight

app.use(express.json());

app.all('*', handler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
