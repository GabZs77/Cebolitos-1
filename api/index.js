import express from 'express';
import cors from 'cors';
import handler from './server.js'; // Certifique-se que esse arquivo existe

const app = express();

// Middleware para CORS e JSON
app.use(cors());
app.use(express.json());

// Log de requisições (opcional para debug)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Todas as requisições vão para o handler
app.all('*', handler);

// Porta obrigatória para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
