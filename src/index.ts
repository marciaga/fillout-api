import express, { Express } from 'express';
import dotenv from 'dotenv';

import formResponses from './routes/formResponses';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// set up routes
app.use('/form-responses', formResponses);

// set up error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
