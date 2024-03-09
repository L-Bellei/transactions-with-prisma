import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		return res.status(200).json({
			success: false,
			error: err.message,
		});
	}

	return res.status(500).json({
		status: 'erro',
		message: 'Erro interno no servidor',
	});
});

export { app };
