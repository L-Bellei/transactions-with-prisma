import { Router } from 'express';
import CarroController from './controllers/CarroController';

const routes = Router();

routes.post('/carro', new CarroController().criar);

routes.put('/carro', new CarroController().atualizar);

routes.get('/carro/:id', new CarroController().buscarUm);

routes.get('/carro', new CarroController().buscarTodos);

export default routes;
