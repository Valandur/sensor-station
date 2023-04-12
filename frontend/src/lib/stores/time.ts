import { isSameDay } from 'date-fns';
import Holidays, { type HolidaysTypes } from 'date-holidays';
import { derived, readable } from 'svelte/store';

const UPDATE_INTERVAL = 10000;

export const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, UPDATE_INTERVAL);

	set(new Date());

	return function stop() {
		clearInterval(interval);
	};
});

const holidays = new Holidays('CH', 'ZH');

let lastHoliday: HolidaysTypes.Holiday | null = null;
let lastCheck = new Date(0);
export const holiday = derived(time, ($time) => {
	if (isSameDay(lastCheck, $time)) {
		return lastHoliday;
	}

	const holi = holidays.isHoliday($time);
	lastHoliday = holi ? holi[0] : null;
	lastCheck = $time;

	return lastHoliday;
});
