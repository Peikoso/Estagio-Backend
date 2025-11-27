import express from 'express';
import cors from 'cors';
import process from 'process';
import routes from './routers/index.js';
import { AuthMiddleware } from './middleware/auth-middleware.js';
import { ErrorMiddleware } from './middleware/error-middleware.js';
import { ValidateBodyMiddleware } from './middleware/validate-body-middleware.js';
import { config } from './config/index.js';
import { runnerScheduler } from './worker/runner-scheduler.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(AuthMiddleware);  // Desativado temporariamente para permitir acesso sem autenticação
app.use(ValidateBodyMiddleware)

const PORT = config.PORT || 8000;

app.get('/', async(req, res) => {
    res.json('Bem Vindo ao QQMonitor');
});

app.use('/api/v1', routes);
app.use(ErrorMiddleware);

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  // Em produção pode ser desejável reiniciar o processo
}); // sem esses handlers, a aplicação pode morrer sem logs claros, com eles você pelo menos registra o erro.

// Start
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);

    // Inicia o Runner Scheduler e Worker
  if (config.ENABLE_RUNNER_WORKER !== 'false') {
    console.log('Iniciando Runner Scheduler...');
    runnerScheduler.start().catch(error => {
      console.error('Erro ao iniciar Runner Scheduler:', error);
    });

  } else {
    console.log('Runner System está desativado via configuração.');
  }
});