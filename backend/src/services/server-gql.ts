export const GQL_SCHEMA = `
type Query {
	battery: Battery!
	calendar: Calendar!
	games: Games!
	modem: Modem!
	network: Network!
	news: News!
	sbb: SBB!
	screens: [Screen!]!
	sensors: Sensors!
	uploads: Uploads!
	weather: Weather!
}

type Mutation {
	saveScreens(screens: [ScreenInput!]!): [Screen!]!
	restart: Boolean!
}

type Battery {
	status: BatteryStatus
}

type BatteryStatus {
	isFault: Boolean!
	isButton: Boolean!
	status: String!
	powerIn: String!
	powerIn5vIo: String!
	charge: Float!
	voltage: Float!
	current: Float!
}

type Calendar {
	events: [CalendarEvent!]
}

type CalendarEvent {
	tsStart: String!
	tsEnd: String!
	content: String!
	isWholeDay: Boolean!
}

type Games {
	freeEpic: [Game!]
}

type Game {
	title: String!
	startsAt: String!
	endsAt: String!
	image: String
}

type Modem {
	status: ModemStatus
}

type ModemStatus {
	isConnected: Boolean!
	time: String!
	tzOffset: String!
	operator: String!
	signal: Float!
	lat: Float!
	lng: Float!
	tzName: String!
	cached: Boolean!
}

type Network {
	interfaces: [NetworkInterface!]
}

type NetworkInterface {
	name: String!
	ips: [String!]!
}

type News {
	items(feed: String!): [NewsItem!]
}

type NewsItem {
	id: String!
	ts: String!
	title: String!
	content: String!
	img: String!
}

type SBB {
	alerts: [SBBAlert!]
}

type SBBAlert {
	start: String!
	end: String!
	planned: Boolean!
	summary: String!
	reason: String
	description: String
	consequence: String
	duration: String
	recommendation: String
}

type Screen {
	name: String!
	params: String!
}

input ScreenInput {
	id: Int
	name: String!
	params: String!
}

type Sensors {
	newest: SensorRecording
	recordings: [SensorRecording!]
}

type SensorRecording {
	ts: String!
	temp: Float!
	rh: Float!
}

type Uploads {
	items: [UploadItem!]
}

type UploadItem {
	ts: String!
	title: String!
	img: String!
	ratio: Float!
}

type Weather {
	hourly: [WeatherForecast!]
	daily: [WeatherForecast!]
	alerts: [WeatherAlert!]
}

type WeatherForecast {
	ts: String!
	img: String!
	feelsLike: Float!
}

type WeatherAlert {
	sender: String!
	event: String!
	start: String!
	end: String!
	description: String!
	tags: [String!]!
}

`;
