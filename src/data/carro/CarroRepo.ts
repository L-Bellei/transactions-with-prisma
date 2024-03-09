import { Carro } from '@prisma/client';
import { createTransaction } from '../../prisma';

export default class CarroRepo {
	async criar(carro: Carro) {
		await createTransaction('create', 'carro', carro);
	}

	async atualizar(carro: Carro) {
		await createTransaction('update', 'carro', carro);
	}

	async buscarUm(carroId: number) {
		await createTransaction('findFirst', 'carro', carroId);
	}

	async buscarTodos() {
		await createTransaction('findAll', 'carro', null);
	}
}
