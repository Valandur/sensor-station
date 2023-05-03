import { isSameDay } from 'date-fns';
import Holidays, { type HolidaysTypes } from 'date-holidays';

const holidays = new Holidays('CH', 'ZH');

let lastHoliday: HolidaysTypes.Holiday | null = null;
let lastCheck = new Date(0);

export function getHoliday() {
	const now = new Date();
	if (isSameDay(lastCheck, now)) {
		return lastHoliday;
	}

	const holi = holidays.isHoliday(now);
	lastHoliday = holi ? holi[0] : null;
	lastCheck = now;

	return lastHoliday;
}
