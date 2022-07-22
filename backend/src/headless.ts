import { appendFile, mkdir, stat, writeFile } from 'fs/promises';
import { format } from 'date-fns';

import 'dotenv/config';

import { Weather } from './weather';

const RECORD_INTERVAL = 60 * 1000;

const main = async () => {
	// Weather
	console.log('weather...');
	const weather = new Weather();
	await weather.init();

	await mkdir('./data/recordings/', { recursive: true });

	const record = async () => {
		try {
			await weather.update();
			const { temp, rh } = weather.status;
			const date = new Date();
			const fileName = `./data/recordings/${format(date, 'YYYY_MM')}.txt`;

			if (!(await stat(fileName).catch(() => false))) {
				await writeFile(fileName, `${date},${temp},${rh}\n`, 'utf-8');
			} else {
				await appendFile(fileName, `${date},${temp},${rh}\n`, 'utf-8');
			}

			console.log(`Recorded temp & rh`, date, temp, rh);
		} catch (err) {
			console.error(err);
		}
	};

	await record();
	setInterval(record, RECORD_INTERVAL);
};

main().catch((err) => console.error(err));
