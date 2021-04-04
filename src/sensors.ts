const dht = require('node-dht-sensor').promises;

const DHT_TYPE = 11;
const DHT_PIN = 17;

export class Sensors {
	private interval: NodeJS.Timer;

	private temp: number = null;
	public get temperature() {
		return this.temp;
	}

	private rh: number = null;
	public get humidity() {
		return this.rh;
	}

	private err: string = null;
	public get lastErr() {
		return this.err;
	}

	public init() {
		this.interval = setInterval(this.updateDHT, 1000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private updateDHT = async () => {
		try {
			const res = await dht.read(DHT_TYPE, DHT_PIN);
			console.log(res);
			this.temp = res.temperature;
			this.rh = res.humidity;
			this.err = null;
		} catch (err) {
			this.err = err.message;
		}
	};
}
