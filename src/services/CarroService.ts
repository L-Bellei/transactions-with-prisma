import { Carro } from '@prisma/client';
import CarroRepo from '../data/carro/CarroRepo';
import { commitTransactions } from '../prisma';

export default class CarroService {
	private _carroRepo: CarroRepo;

	constructor() {
		this._carroRepo = new CarroRepo();
	}
	async criar(carro: Carro) {
		const carroCriado = await this._carroRepo.criar(carro);

		return await this.commit();
	}

	async atualizar(carro: Carro) {
		const carroAlterado = await this._carroRepo.atualizar(carro);

		return this.commit();
	}

	async buscarUm(carroId: number) {
		const carroEncontrado = await this._carroRepo.buscarUm(carroId);

		return this.commit();
	}

	async buscarTodos() {
		const carroEncontrado = await this._carroRepo.buscarTodos();

		return this.commit();
	}

	private async commit() {
		return await commitTransactions();
	}
}
