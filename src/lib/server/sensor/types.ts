export interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}
