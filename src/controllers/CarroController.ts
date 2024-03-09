import { Carro } from '../data/carro/model';
import CarroService from '../services/CarroService';
import { Request, Response } from 'express';

export default class CarroController {
	async criar(req: Request, res: Response) {
		const carro: Carro = req.body;
		const service = new CarroService();
		const carroCriado = await service.criar(carro);

		return res.status(201).json({ success: true, data: carroCriado });
	}

	async atualizar(req: Request, res: Response) {
		const carro: Carro = req.body;
		const service = new CarroService();
		const carroAlterado = await service.atualizar(carro);

		return res.status(202).json({ success: true, data: carroAlterado });
	}

	async buscarUm(req: Request, res: Response) {
		const { id } = req.params;
		const service = new CarroService();
		const carroEncontrado = await service.buscarUm(+id);

		return res.status(200).json({ success: true, data: carroEncontrado });
	}

	async buscarTodos(req: Request, res: Response) {
		const service = new CarroService();
		const carroEncontrado = await service.buscarTodos();

		return res.status(200).json({ success: true, data: carroEncontrado });
	}
}
