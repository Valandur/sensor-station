export function isNight(date?: Date) {
	const d = date || new Date();
	const hours = d.getHours();
	return hours > 20 || hours < 6;
}
