import express from 'express';
import routeLogger from './middleware/routeLogger.js';
import { default as userRouter } from './api/user.js';
import { routerLogger } from './middleware/routerLogger.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`This request has reached the server : ${req.url}`);
  next();
});

app.get('/', routeLogger, (req, res, next) => {
  res.status(200).send('Welcome to the server');
});

app.get('/error', routeLogger, (req, res, next) => {
  const dummyError = new Error('dummy error');
  dummyError.sourceURL = '/error';
  next(dummyError);
});

app.use('/user', routerLogger('/user'), userRouter);

app.use((err, req, res, next) => {
  console.log(`error received from ${err.sourceURL ?? 'unknown error source'}`);
  console.error(err);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
