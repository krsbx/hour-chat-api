import cors from 'cors';
import express, { Express } from 'express';
import { errorHandlerMw, queryParserMw } from './middlewares/common';
import routes from './routes';

const root = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(cors());

  app.get('*', queryParserMw);
  app.use('/api', routes);

  app.use(errorHandlerMw);
};

export default root;
