import Holidays from 'date-holidays';
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

export const holiday = derived(time, ($time) => {
	const holi = holidays.isHoliday($time);
	return holi ? holi[0] : null;
});
