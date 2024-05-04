export interface Screen {
	name: string;
	params: string;
}

export const SCREEN_NAMES: { [key: string]: string } = {
	uploads: 'Bilder',
	calendar: 'Kalender',
	news: 'News',
	printer: 'Drucker',
	post: 'Post',
	sbb: 'SBB',
	games: 'Spiele',
	weather: 'Wetter',
	tuya: 'Tuya'
};

export const SCREEN_PARAMS: { [key: string]: { [key: string]: string } } = {
	news: {
		'1646': 'Allgemein',
		'718': 'Sport',
		'454': 'Kultur',
		'630': 'Wissen'
	},
	weather: {
		daily: 'Täglich',
		hourly: 'Stündlich',
		alerts: 'Warnungen'
	},
	sbb: {
		alerts: 'Einschränkungen',
		departures: 'Abfahrten'
	}
};
