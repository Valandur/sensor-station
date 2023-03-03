import 'dotenv/config';

import './types';
import { Application } from './app';

const main = async () => {
	const app = new Application();
	await app.init();
	await app.start();

	const shutdown = async () => {
		await app.stop();
		await app.dispose();
		process.exit(0);
	};

	process.on('SIGTERM', shutdown);
	process.on('SIGINT', shutdown);
};

main().catch((err) => console.error(err));
