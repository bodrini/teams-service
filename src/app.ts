import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import teamsRouter from './modules/teams/teams.controller';
import healthRouter from './modules/health/health.controller';
import { errorHandler } from './common/middleware/error-handler';
import { logger } from './logger';
import { config } from './config';
import pinoHttp from 'pino-http';

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  }),
);

app.use('/api', teamsRouter);
app.use('/api', healthRouter);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
});
