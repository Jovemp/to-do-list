import { Router } from 'express';
import './config/yup_location';

import TodoController from './app/controllers/TodoController';

const routes = new Router();

routes.get('/test', (req, res) => res.status(200).json({ ok: true, timestamp: new Date() }));
routes.post('/todos', TodoController.store);
routes.get('/todos', TodoController.index);

export default routes;

