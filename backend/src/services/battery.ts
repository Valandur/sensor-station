import { appendFile, mkdir, stat } from 'fs/promises';
import type { PromisifiedBus } from 'i2c-bus';

import { Service } from './service';
import { dirname } from 'path';

const RECORDINGS_PATH = 'data/battery/recordings.csv';

const CMD_STATUS = 0x40;
const CMD_FAULT_EVENT = 0x44;
const CMD_CHARGE_LEVEL = 0x41;
// const CMD_BUTTON_EVENT = 0x45;
const CMD_BATTERY_TEMPERATURE = 0x47;
const CMD_BATTERY_VOLTAGE = 0x49;
const CMD_BATTERY_CURRENT = 0x4b;
const CMD_IO_VOLTAGE = 0x4d;
const CMD_IO_CURRENT = 0x4f;
// const CMD_LED_STATE = 0x66;
// const CMD_LED_BLINK = 0x68;
// const CMD_IO_PIN_ACCESS = 0x75;

export enum BatteryStatus {
	'NORMAL' = 0,
	'CHARGING_FROM_IN' = 1,
	'CHARGING_FROM_5V_IO' = 2,
	'NONE' = 3
}

export enum PowerState {
	'NONE' = 0,
	'BAD' = 1,
	'WEAK' = 2,
	'PRESENT' = 3
}

export enum ChargingTemperature {
	'NORMAL' = 0,
	'SUSPEND' = 1,
	'COOL' = 2,
	'WARM' = 3
}

export interface StatusInfo {
	ts: string;
	isFault: boolean;
	isButton: boolean;
	status: string;
	charge: number;
	temperature: number;
	powerIn: {
		state: string;
		voltage: number;
		current: number;
	};
	powerIn5vIo: {
		state: string;
		voltage: number;
		current: number;
	};
	fault: {
		buttonPowerOff: boolean;
		forcedPowerOff: boolean;
		forcedSysPowerOff: boolean;
		watchdogReset: boolean;
		batteryProfileInvalid: boolean;
		chargingTemperatureFault: string;
	};
}

export class Battery extends Service {
	private readonly busNumber = process.env['BATTERY_BUS_NUMBER'] ? Number(process.env['BATTERY_BUS_NUMBER']) : 0x01;
	private readonly i2cAddress = process.env['BATTERY_I2C_ADDRESS'] ? Number(process.env['BATTERY_I2C_ADDRESS']) : 0x14;
	private readonly recordingInterval = process.env['BATTERY_RECORDING_INTERVAL']
		? Number(process.env['BATTERY_RECORDING_INTERVAL'])
		: null;

	private bus: PromisifiedBus | null = null;
	private lastRecordedTs: string | null = null;
	private recordTimer: NodeJS.Timer | null = null;

	public status: StatusInfo | null = null;

	protected override async doInit(): Promise<void> {
		await mkdir(dirname(RECORDINGS_PATH), { recursive: true });

		if (!(await this.checkDevice())) {
			return;
		}

		try {
			const i2c = require('i2c-bus');
			this.bus = await i2c.openPromisified(this.busNumber);
		} catch (err) {
			this.error(err);
		}
	}

	protected override async doStart(): Promise<void> {
		this.status = null;

		if (this.recordingInterval) {
			const interval = 1000 * this.recordingInterval;
			this.recordTimer = setInterval(this.record, interval);
			this.log('RECORDING SCHEDULED', interval);
		} else {
			this.log('RECORDING DISABLED');
		}
	}

	protected override async doUpdate(): Promise<void> {
		if (!this.bus) {
			if (this.isDebug) {
				this.status = {
					ts: new Date().toISOString(),
					isFault: Math.random() > 0.5,
					isButton: Math.random() > 0.5,
					status: BatteryStatus[Math.round(Math.random() * 3)]!,
					charge: Math.round(Math.random() * 100),
					temperature: Math.round(Math.random() * 100) / 10,
					powerIn: {
						state: PowerState[Math.round(Math.random() * 3)]!,
						current: Math.round(Math.random() * 1000) / 100 - 5,
						voltage: Math.round(Math.random() * 1000) / 100 - 5
					},
					powerIn5vIo: {
						state: PowerState[Math.round(Math.random() * 3)]!,
						voltage: Math.round(Math.round(Math.random() * 1000) / 100 - 5),
						current: Math.round(Math.round(Math.random() * 1000) / 100 - 5)
					},
					fault: {
						batteryProfileInvalid: Math.random() > 0.5,
						buttonPowerOff: Math.random() > 0.5,
						forcedPowerOff: Math.random() > 0.5,
						forcedSysPowerOff: Math.random() > 0.5,
						watchdogReset: Math.random() > 0.5,
						chargingTemperatureFault: ChargingTemperature[Math.round(Math.random() * 3)]!
					}
				};
			}
			return;
		}

		this.status = await this.getStatus();
	}

	protected override async doStop(): Promise<void> {
		if (this.recordTimer) {
			clearInterval(this.recordTimer);
			this.recordTimer = null;
		}

		this.status = null;
	}

	protected override async doDispose(): Promise<void> {
		if (this.bus) {
			await this.bus.close();
			this.bus = null;
		}
	}

	private async checkDevice() {
		const path = `/dev/i2c-${this.busNumber}`;

		try {
			await stat(path);
			return true;
		} catch {
			this.warn(`PiJuice not available @ ${path}`);
			return false;
		}
	}

	private async getStatus(): Promise<StatusInfo> {
		const data = await this.read(CMD_STATUS, 1);

		const rawStatus = data.readUint8(0);
		const isFault = (rawStatus & 0x01) !== 0;
		const isButton = (rawStatus & 0x02) !== 0;
		const status = BatteryStatus[(rawStatus >>> 2) & 0x03] || 'UNKNOWN';
		const powerIn = PowerState[(rawStatus >>> 4) & 0x03] || 'UNKNOWN';
		const powerIn5vIo = PowerState[(rawStatus >>> 6) & 0x03] || 'UNKNOWN';

		const charge = await this.getChargeLevel();
		const temperature = await this.getBatteryTemperature();
		const fault = await this.getFaultStatus();
		const voltage = await this.getBatteryVoltage();
		const current = await this.getBatteryCurrent();
		const ioVoltage = await this.getIOVoltage();
		const ioCurrent = await this.getIOCurrent();

		return {
			ts: new Date().toISOString(),
			isFault,
			isButton,
			status,
			charge,
			temperature,
			powerIn: {
				state: powerIn,
				voltage: voltage,
				current: current
			},
			powerIn5vIo: {
				state: powerIn5vIo,
				voltage: ioVoltage,
				current: ioCurrent
			},
			fault
		};
	}

	private async getChargeLevel() {
		const data = await this.read(CMD_CHARGE_LEVEL, 1);
		return data.readUint8(0);
	}

	private async getBatteryTemperature() {
		const data = await this.read(CMD_BATTERY_TEMPERATURE, 2);
		let temp = data.readUint8(0);
		if (temp & (1 << 7)) {
			temp = temp - (1 << 8);
		}
		return temp;
	}

	private async getBatteryVoltage() {
		const data = await this.read(CMD_BATTERY_VOLTAGE, 2);
		return data.readUInt16LE(0) / 1000;
	}

	private async getBatteryCurrent() {
		const data = await this.read(CMD_BATTERY_CURRENT, 2);
		let curr = data.readUInt16LE(0);
		if (curr & (1 << 15)) {
			curr = curr - (1 << 16);
		}
		return curr / 1000;
	}

	private async getIOVoltage() {
		const data = await this.read(CMD_IO_VOLTAGE, 2);
		return data.readUInt16LE(0) / 1000;
	}

	private async getIOCurrent() {
		const data = await this.read(CMD_IO_CURRENT, 2);
		let curr = data.readUInt16LE(0);
		if (curr & (1 << 15)) {
			curr = curr - (1 << 16);
		}
		return curr / 1000;
	}

	private async getFaultStatus() {
		const data = await this.read(CMD_FAULT_EVENT, 1);

		const status = data.readUint8(0);
		const buttonPowerOff = (status & 0x01) !== 0;
		const forcedPowerOff = (status & 0x02) !== 0;
		const forcedSysPowerOff = (status & 0x04) !== 0;
		const watchdogReset = (status & 0x08) !== 0;
		const batteryProfileInvalid = (status & 0x20) !== 0;
		const chargingTemperatureFault = ChargingTemperature[(status >>> 6) & 0x03] || 'UNKNOWN';

		return {
			buttonPowerOff,
			forcedPowerOff,
			forcedSysPowerOff,
			watchdogReset,
			batteryProfileInvalid,
			chargingTemperatureFault
		};
	}

	private read = async (cmd: number, len: number, retry?: boolean): Promise<Buffer> => {
		if (!this.bus) {
			throw new Error('Bus not initialized');
		}

		const { buffer, bytesRead } = await this.bus.readI2cBlock(this.i2cAddress, cmd, len + 1, Buffer.alloc(len + 1));
		if (bytesRead !== len + 1) {
			throw new Error(`Read ${bytesRead} instead of ${len + 1} bytes`);
		}

		let check = 0xff;
		for (let i = 0; i < buffer.length - 1; i++) {
			check ^= buffer.readUint8(i);
		}

		if (check !== buffer[buffer.length - 1]) {
			// With n+1 byte data (n data bytes and 1 checksum byte) sometimes the
			// MSbit of the first received data byte is 0 while it should be 1. So we
			// repeat the checksum test with the MSbit of the first data byte set to 1.
			// See: https://github.com/PiSupply/PiJuice/blob/master/Software/Source/pijuice.py#L97
			buffer[0] |= 0x80;
			let check2 = 0xff;
			for (let i = 0; i < buffer.length - 1; i++) {
				check2 ^= buffer.readUint8(i);
			}

			if (check2 !== buffer[buffer.length - 1]) {
				if (!retry) {
					return await this.read(cmd, len, true);
				} else {
					throw new Error(`Checksums ${check} and ${check2} don't match ${buffer[buffer.length - 1]}`);
				}
			}
		}

		return buffer.slice(0, buffer.length - 1);
	};

	private record = async () => {
		try {
			if (!this.status) {
				this.error('Could not record status, no status present!');
				return;
			}

			if (this.lastRecordedTs === this.status.ts) {
				this.error('Skipping recording because no new status is available');
				return;
			}

			await appendFile(RECORDINGS_PATH, this.statusToCsv(this.status), 'utf-8');

			this.lastRecordedTs = this.status.ts;

			this.log(`Recorded status`, this.status.ts, this.status.status, this.status.charge);
		} catch (err) {
			this.error(err);
		}
	};

	private statusToCsv(s: StatusInfo): string {
		const p = s.powerIn;
		const p5 = s.powerIn5vIo;
		const f = s.fault;
		return (
			`${s.ts},${s.isFault},${s.isButton},${s.status},${s.charge},${s.temperature},${p.state},${p.voltage},${p.current},` +
			`${p5.state},${p5.voltage},${p5.current},${f.buttonPowerOff}.${f.forcedPowerOff},${f.forcedSysPowerOff},${f.watchdogReset},${f.batteryProfileInvalid},${f.chargingTemperatureFault}\n`
		);
	}
}
