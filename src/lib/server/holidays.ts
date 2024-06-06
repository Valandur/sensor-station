import { isSameDay } from 'date-fns';
import Holidays, { type HolidaysTypes } from 'date-holidays';

import { BaseLogger } from '$lib/models/BaseLogger';

const holidays = new Holidays('CH', 'ZH');

const logger = new BaseLogger('HOLIDAYS');

let lastHoliday: HolidaysTypes.Holiday | null = null;
let lastCheck = new Date(0);

export function getHoliday() {
	const now = new Date();
	if (isSameDay(lastCheck, now)) {
		logger.debug('Using cached data');
		return lastHoliday;
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		const holi = holidays.isHoliday(now);
		lastHoliday = holi ? holi[0] : null;
		lastCheck = now;
	} catch (err) {
		logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}

	return lastHoliday;
}
