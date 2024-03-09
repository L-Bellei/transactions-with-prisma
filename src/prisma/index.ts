import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: ['query', 'info', 'warn'],
});

const transactions: any[] = [];

async function createTransaction(action: string, tableName: string, data: any) {
	const transaction = { action, tableName, data };
	transactions.push(transaction);
}

async function commitTransactions() {
	try {
		const results: any[] = [];

		await prisma.$transaction(async (tx) => {
			for (const transaction of transactions) {
				results.push(await executeTransaction(tx, transaction));
			}
		});

		console.log('Transactions committed successfully.');

		transactions.length = 0;

		return results.length > 1 ? results : results[0];
	} catch (error) {
		console.error('Transaction error:', error);

		console.log('Rolling back changes...');

		await rollback();

		throw new Error('Could not commit transactions.');
	}
}

async function executeTransaction(tx, transaction) {
	const { action, tableName, data } = transaction;
	const table = tx[tableName];

	if (!table) throw new Error('Table name not supported');

	switch (action) {
		case 'create':
			return await table.create({ data });
		case 'update':
			return await table.update({ where: { id: data.id }, data });
		case 'delete':
			return await table.delete({ where: { id: data.id } });
		case 'findFirst':
			return await table.findFirst({ where: { id: data } });
		case 'findAll':
			return await table.findMany();
		default:
			throw new Error('Action not supported');
	}
}

async function rollback() {
	try {
		await prisma.$transaction(async (tx) => {
			for (let i = transactions.length - 1; i >= 0; i--) {
				const transaction = transactions[i];
				await revertTransaction(tx, transaction);
			}
		});
		console.log('Rollback successful.');
		transactions.length = 0;
	} catch (error) {
		console.error('Rollback error:', error);
		throw new Error('Could not rollback transactions.');
	}
}

async function revertCreateAction(table, data) {
	await table.delete({ where: { id: data.id } });
}

async function revertUpdateAction(table, data) {
	const oldData = await table.findUnique({ where: { id: data.id } });
	if (oldData) {
		await table.update({ where: { id: data.id }, data: oldData });
	}
}

async function revertDeleteAction(table, data) {
	await table.create({ data });
}

async function revertTransaction(tx, transaction) {
	const { action, tableName, data } = transaction;
	const table = tx[tableName];

	if (!table) throw new Error('Table name not supported');

	switch (action) {
		case 'create':
			await revertCreateAction(table, data);
			break;
		case 'update':
			await revertUpdateAction(table, data);
			break;
		case 'delete':
			await revertDeleteAction(table, data);
			break;
		default:
			throw new Error('Action not supported');
	}
}

export { createTransaction, commitTransactions };
