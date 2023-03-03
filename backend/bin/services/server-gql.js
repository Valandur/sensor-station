"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQL_SCHEMA = void 0;
exports.GQL_SCHEMA = `
type Query {
	battery: Battery!
	modem: Modem!
	network: Network!
	weather: Weather!
	sensors: Sensors!
	news: News!
	calendar: Calendar!
	uploads: Uploads!
	screens: [Screen!]!
}

type Mutation {
	saveScreens(screens: [ScreenInput!]!): [Screen!]!
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

type Sensors {
	newest: SensorRecording
	recordings: [SensorRecording!]
}

type SensorRecording {
	ts: String!
	temp: Float!
	rh: Float!
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

type Calendar {
	events: [CalendarEvent!]
}

type CalendarEvent {
	ts: String!
	repeats: String!
	description: String!
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

input ScreenInput {
	id: Int
	name: String!
	params: String!
}

type Screen {
	id: Int!
	name: String!
	params: String!
}
`;
