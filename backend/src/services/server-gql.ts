export const GQL_SCHEMA = `
type Query {
	battery: Battery!
	calendar: Calendar!
	games: Games!
	modem: Modem!
	network: Network!
	news: News!
	post: Post!
	sbb: SBB!
	screens: [Screen!]!
	sensors: Sensors!
	uploads: Uploads!
	weather: Weather!
}

type Mutation {
	saveScreens(screens: [ScreenInput!]!): [Screen!]!
	saveUpload(img: String!, ts: String!, title: String!): [UploadItem!]
	deleteUpload(img: String!): [UploadItem!]
	restart: Boolean!
}

type Battery {
	updatedAt: String
	status: BatteryStatus
}

type BatteryPowerInfo {
	state: String!
	voltage: Float!
	current: Float!
}

type BatteryFaultInfo {
	buttonPowerOff: Boolean!
	forcedPowerOff: Boolean!
	forcedSysPowerOff: Boolean!
	watchdogReset: Boolean!
	batteryProfileInvalid: Boolean!
	chargingTemperatureFault: String!
}

type BatteryStatus {
	isFault: Boolean!
	isButton: Boolean!
	status: String!
	charge: Float!
	temperature: Float!
	powerIn: BatteryPowerInfo!
	powerIn5vIo: BatteryPowerInfo!
	fault: BatteryFaultInfo!
}

type Calendar {
	updatedAt: String
	events: [CalendarEvent!]
}

type CalendarEvent {
	tsStart: String!
	tsEnd: String!
	content: String!
	isWholeDay: Boolean!
}

type Games {
	updatedAt: String
	freeEpic: [Game!]
}

type Game {
	title: String!
	startsAt: String!
	endsAt: String!
	image: String
}

type Modem {
	updatedAt: String
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
	updatedAt: String
	interfaces: [NetworkInterface!]
}

type NetworkInterface {
	name: String!
	ips: [String!]!
}

type News {
	updatedAt: String
	items(feed: String!): [NewsItem!]
}

type NewsItem {
	id: String!
	ts: String!
	title: String!
	content: String!
	img: String!
}

type Post {
	updatedAt: String
	shipments: [Shipment!]
}

type ShipmentDimensions {
	x: Int!
	y: Int!
	z: Int!
}

type Shipment {
	number: String!
	type: String!
	arrival: String
	status: String
	sender: String!
	dims: ShipmentDimensions
	weight: Int
}

type SBB {
	updatedAt: String
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
	updatedAt: String
	newest: SensorRecording
	recordings: [SensorRecording!]
}

type SensorRecording {
	ts: String!
	temp: Float!
	rh: Float!
}

type Uploads {
	updatedAt: String
	items: [UploadItem!]
}

type UploadItem {
	ts: String!
	title: String!
	img: String!
	ratio: Float!
}

type Weather {
	updatedAt: String
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
	content: String!
	tags: [String!]!
}

`;
