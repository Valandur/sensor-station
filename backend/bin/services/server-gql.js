"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQL_SCHEMA = void 0;
exports.GQL_SCHEMA = `
type Query {
	battery: BatteryStatusInfo
	modem: ModemStatusInfo
	interfaces: [NetworkInterface!]
	sensors: SensorsStatusInfo
	forecasts: [WeatherForecast!]
	alerts: [WeatherAlert!]
	news(feed: String!): [NewsItem!]
	recordings: [Recording!]
	uploads: [Upload!]
	events: [CalendarEvent!]
	screens: [Screen!]!
}

type Mutation {
	saveScreens(screens: [ScreenInput!]!): [Screen!]!
}

type BatteryStatusInfo {
	isFault: Boolean!
	isButton: Boolean!
	batteryStatus: String!
	powerIn: String!
	powerIn5vIo: String!
	charge: Float!
	voltage: Float!
	current: Float!
}

type ModemStatusInfo {
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

type NetworkInterface {
	name: String!
	ips: [String!]!
}

type SensorsStatusInfo {
	ts: String!
	temp: Float!
	rh: Float!
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

type NewsItem {
	id: String!
	ts: String!
	title: String!
	content: String!
	img: String!
}

type Recording {
	ts: String!
	temp: Float!
	rh: Float!
}

type Upload {
	ts: String!
	title: String!
	img: String!
	ratio: Float!
}

type CalendarEvent {
	ts: String!
	repeats: String!
	description: String!
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
