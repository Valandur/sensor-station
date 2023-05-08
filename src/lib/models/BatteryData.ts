import type { BaseData } from './BaseData';
import type { BatteryFault } from './BatteryFault';
import type { BatteryPower } from './BatteryPower';

export interface BatteryData extends BaseData {
	isFault: boolean;
	isButton: boolean;
	state: string;
	charge: number;
	temperature: number;
	powerIn: BatteryPower;
	powerIn5vIo: BatteryPower;
	fault: BatteryFault;
}
