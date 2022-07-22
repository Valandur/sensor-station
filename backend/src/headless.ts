import { appendFile, mkdir, stat, writeFile } from 'fs/promises';

import 'dotenv/config';

import { Weather } from './weather';

const RECORD_INTERVAL = 60000;

const main = async () => {
	// Weather
	console.log('weather...');
	const weather = new Weather();
	await weather.init();

	await mkdir('./data/', { recursive: true });
	if (!(await stat('./data/recordings.txt').catch(() => false))) {
		await writeFile('./data/recordings.txt', '', 'utf-8');
	}

	const record = async () => {
		try {
			const { temp, rh } = weather.status;
			const date = new Date().toISOString();
			await appendFile('./data/recordings.txt', `${date},${temp},${rh}\n`, 'utf-8');
			console.log(`Recorded temp & rh`, date, temp, rh);
		} catch (err) {
			console.error(err);
		}
	};

	await record();
	setInterval(record, RECORD_INTERVAL);
};

main().catch((err) => console.error(err));
