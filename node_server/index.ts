import express, { Errback, Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import searchRouter from './src/routes/search.route';
import syncRouter from './src/routes/sync.route';
import bodyParser from 'body-parser';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req: Request, res: Response) => {
  res.json({ 'message': 'ok' });
})

app.use('/search', searchRouter);
app.use('/sync', syncRouter);

/* Error handler middleware */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
  return;
});

app.listen(port, () => {
  console.log(`Node Server is running at http://localhost:${port}`);
});
