export function minutesToTz(total: number) {
	const tzSign = total > 0 ? '+' : '-';
	const tzHours = `${Math.floor(Math.abs(total) / 60)}`.padStart(2, '0');
	const tzMinutes = `${Math.abs(total) % 60}`.padStart(2, '0');
	return `${tzSign}${tzHours}:${tzMinutes}`;
}
