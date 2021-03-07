import express from 'express';
import routes from './routes';
import cors from 'cors';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.tratarErros();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  tratarErros() {
    this.server.get('*', function (req, res) {
      res.json({ message: 'Ocorreu um erro ao chamar a api' });
    });
  }
}

export default new App().server;
