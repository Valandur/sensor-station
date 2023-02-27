import 'dotenv/config';

import './types';

import { Application } from './app';

const main = async () => {
	const app = new Application();
	await app.init();
	await app.run();
};

main().catch((err) => console.error(err));
