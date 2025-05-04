import express from 'express';
import handler from './server.js'; // importe seu arquivo original

const app = express();
app.use(express.json());
app.all('*', handler); // usa seu handler para todas as rotas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
