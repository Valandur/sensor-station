import { appendFile } from 'fs/promises';

import 'dotenv/config';

import { Weather } from './weather';

const RECORD_INTERVAL = 60000;

const main = async () => {
	// Weather
	console.log('weather...');
	const weather = new Weather();
	await weather.init();

	const record = async () => {
		try {
			const { temp, rh } = weather.status;
			const date = new Date().toISOString();
			await appendFile('./data/recordings.txt', `${date},${temp},${rh}`, 'utf-8');
			console.log(`Recorded temp & rh`, date, temp, rh);
		} catch (err) {
			console.error(err);
		}
	};

	await record();
	setInterval(record, RECORD_INTERVAL);
};

main().catch((err) => console.error(err));
