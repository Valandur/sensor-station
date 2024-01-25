export interface PrinterInfo {
	job: {
		id?: number;
		progress: number;
		time_remaining: number;
		time_printing: number;
	};
	storage: {
		path: string;
		name: string;
		read_only: boolean;
	};
	printer: {
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
	};
}
