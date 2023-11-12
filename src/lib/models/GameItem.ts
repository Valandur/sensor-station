export interface GameItem {
	title: string;
	pct: number;
	startsAt: Date;
	endsAt: Date | null;
	image: string | null;
}
