import type { ServiceConfig, ServiceData } from './service';
import type { WidgetConfig, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const PRUSA_WIDGET_TYPE = 'prusa';

export interface PrusaWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface PrusaWidgetProps extends WidgetProps {
	job: JobInfo;
	storage: StorageInfo;
	printer: PrinterInfo;
}

// ---------
// Service
// ---------

export const PRUSA_SERVICE_TYPE = 'prusa';

export interface PrusaServiceData extends ServiceData {
	job: JobInfo;
	storage: StorageInfo;
	printer: PrinterInfo;
}

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
