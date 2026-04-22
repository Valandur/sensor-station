import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const PRUSA_SERVICE_TYPE = 'prusa';
export const PRUSA_SERVICE_ACTIONS = ['main', 'config'] as const;

export type PrusaServiceAction = (typeof PRUSA_SERVICE_ACTIONS)[number];

export interface PrusaServiceConfig extends ServiceConfig {
	apiUrl: string;
	apiKey: string;
}

// ---------
// Others
// ---------

export interface JobInfo {
	id?: number;
	progress: number;
	time_remaining: number;
	time_printing: number;
}

export interface StorageInfo {
	path: string;
	name: string;
	read_only: boolean;
}

export interface PrinterInfo {
	state: string;
	temp_bed: number;
	target_bed: number;
	temp_nozzle: number;
	target_nozzle: number;
	axis_z: number;
	flow: number;
	speed: number;
	fan_hotend: number;
	fan_print: number;
}
