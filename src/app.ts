import 'reflect-metadata';
import express from 'express';
import teamsRouter from './modules/teams/teams.controller';
import { errorHandler } from './common/middleware/error-handler';

const app = express();

// Включаем парсинг JSON-запросов
app.use(express.json()); // <-- добавлено для поддержки методов POST/PATCH/PUT

const PORT = 3000;

app.use('/api', teamsRouter);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
