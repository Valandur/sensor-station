import { stat } from 'node:fs/promises';
import type * as I2C from 'i2c-bus';

import { BatteryChargingTemperature, BatteryPowerState, BatteryState } from '$lib/models/battery';

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

export class Device {
	private bus: I2C.PromisifiedBus | null = null;
	private busNumber: number;
	private i2cAddress: number;

	public constructor(busNumber: number, i2cAddress: number) {
		this.busNumber = busNumber;
		this.i2cAddress = i2cAddress;
	}

	public async open(): Promise<void> {
		const str = 'i2c';
		const i2c: typeof I2C = await import(/* @vite-ignore */ `${str}-bus`);
		this.bus = await i2c.openPromisified(this.busNumber);
	}

	public async close(): Promise<void> {
		return this.bus?.close();
	}

	public async checkReady(): Promise<boolean> {
		const path = `/dev/i2c-${this.busNumber}`;
		if (!(await stat(path).catch(() => null))) {
			return false;
		}

		return true;
	}

	public async readAll() {
		const data = await this.read(CMD_STATUS, 1);

		const rawStatus = data.readUint8(0);
		const isFault = (rawStatus & 0x01) !== 0;
		const isButton = (rawStatus & 0x02) !== 0;
		const state = BatteryState[(rawStatus >>> 2) & 0x03] || 'UNKNOWN';
		const powerIn = BatteryPowerState[(rawStatus >>> 4) & 0x03] || 'UNKNOWN';
		const powerIn5vIo = BatteryPowerState[(rawStatus >>> 6) & 0x03] || 'UNKNOWN';

		const charge = await this.getChargeLevel();
		const temperature = await this.getBatteryTemperature();
		const fault = await this.getFaultStatus();
		const voltage = await this.getBatteryVoltage();
		const current = await this.getBatteryCurrent();
		const ioVoltage = await this.getIOVoltage();
		const ioCurrent = await this.getIOCurrent();

		return {
			isFault,
			isButton,
			state,
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

	private async getChargeLevel(): Promise<number> {
		const data = await this.read(CMD_CHARGE_LEVEL, 1);
		return data.readUint8(0);
	}

	private async getBatteryTemperature(): Promise<number> {
		const data = await this.read(CMD_BATTERY_TEMPERATURE, 2);
		let temp = data.readUint8(0);
		if (temp & (1 << 7)) {
			temp = temp - (1 << 8);
		}
		return temp;
	}

	private async getBatteryVoltage(): Promise<number> {
		const data = await this.read(CMD_BATTERY_VOLTAGE, 2);
		return data.readUInt16LE(0) / 1000;
	}

	private async getBatteryCurrent(): Promise<number> {
		const data = await this.read(CMD_BATTERY_CURRENT, 2);
		let curr = data.readUInt16LE(0);
		if (curr & (1 << 15)) {
			curr = curr - (1 << 16);
		}
		return curr / 1000;
	}

	private async getIOVoltage(): Promise<number> {
		const data = await this.read(CMD_IO_VOLTAGE, 2);
		return data.readUInt16LE(0) / 1000;
	}

	private async getIOCurrent(): Promise<number> {
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
		const chargingTemperatureFault = BatteryChargingTemperature[(status >>> 6) & 0x03] || 'UNKNOWN';

		return {
			buttonPowerOff,
			forcedPowerOff,
			forcedSysPowerOff,
			watchdogReset,
			batteryProfileInvalid,
			chargingTemperatureFault
		};
	}

	private async read(cmd: number, len: number, retry?: boolean): Promise<Buffer> {
		if (!this.bus) {
			throw new Error('battery.noBus');
		}

		const { buffer, bytesRead } = await this.bus.readI2cBlock(
			this.i2cAddress,
			cmd,
			len + 1,
			Buffer.alloc(len + 1)
		);
		if (bytesRead !== len + 1) {
			throw new Error('battery.incorrectByteCountRead');
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
					throw new Error('battery.invalidChecksum');
				}
			}
		}

		return buffer.subarray(0, buffer.length - 1);
	}
}
