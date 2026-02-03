import 'reflect-metadata';
import express from 'express';
import teamsRouter from './modules/teams/teams.controller';
import healthRouter from './modules/health/health.controller';
import { errorHandler } from './common/middleware/error-handler';

const app = express();

app.use(express.json());

const PORT = 3000;
app.use('/api', teamsRouter);
app.use('/api', healthRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
